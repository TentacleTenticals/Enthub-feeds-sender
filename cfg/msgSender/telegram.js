export const Telegram = {
  m: {// Telegram
    run: 'msgSend',
    timer: 5000,
    getFrom: {
      Site: true,
      DiscordWSS: true
    },
    channelsId: {// Каналы. Можно добавлять типы
      featured: ['30'],
      new: ['30'],
      news: ['30'],
      updates: ['34'],
      feeds: ['30']
    },
    chatId: '-1002104291393'
  }
};