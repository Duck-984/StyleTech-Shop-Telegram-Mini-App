"""
Модуль массовой рассылки.
Отправляет сообщение всем пользователям с учётом лимитов Telegram API:
  - Не более 30 сообщений в секунду
  - Обработка ошибок (бот заблокирован, чат не найден)
"""

import asyncio
import logging
from dataclasses import dataclass

from telegram import Bot
from telegram.error import Forbidden, BadRequest, RetryAfter, TimedOut

import db

logger = logging.getLogger(__name__)

# Telegram допускает ~30 msg/sec, берём с запасом
MESSAGES_PER_SECOND = 25
DELAY = 1.0 / MESSAGES_PER_SECOND


@dataclass
class BroadcastResult:
    """Результат рассылки."""

    total: int = 0
    success: int = 0
    blocked: int = 0
    errors: int = 0


async def broadcast(bot: Bot, text: str) -> BroadcastResult:
    """
    Отправить текстовое сообщение всем пользователям бота.

    Args:
        bot: Экземпляр Telegram Bot
        text: Текст сообщения (поддерживает Markdown)

    Returns:
        BroadcastResult с подробной статистикой
    """
    chat_ids = db.get_all_chat_ids()
    result = BroadcastResult(total=len(chat_ids))

    for chat_id in chat_ids:
        try:
            await bot.send_message(
                chat_id=chat_id,
                text=text,
                parse_mode="HTML",
            )
            result.success += 1

        except Forbidden:
            # Пользователь заблокировал бота
            db.mark_blocked(chat_id)
            result.blocked += 1
            logger.info("User %d blocked the bot, marked.", chat_id)

        except BadRequest as e:
            # Чат не найден или другая ошибка запроса
            if "chat not found" in str(e).lower():
                db.mark_blocked(chat_id)
                result.blocked += 1
            else:
                result.errors += 1
                logger.warning("BadRequest for %d: %s", chat_id, e)

        except RetryAfter as e:
            # Telegram просит подождать (flood control)
            logger.warning("Rate limited. Sleeping %s sec.", e.retry_after)
            await asyncio.sleep(e.retry_after)
            # Повторяем попытку
            try:
                await bot.send_message(chat_id=chat_id, text=text, parse_mode="HTML")
                result.success += 1
            except Exception:
                result.errors += 1

        except TimedOut:
            result.errors += 1
            logger.warning("Timeout for %d", chat_id)

        except Exception as e:
            result.errors += 1
            logger.error("Unexpected error for %d: %s", chat_id, e)

        # Задержка между отправками для защиты от бана
        await asyncio.sleep(DELAY)

    return result
