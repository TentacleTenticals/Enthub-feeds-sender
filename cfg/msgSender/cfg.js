run({
  builder: {
    apps: {
      sendTo: ['TG', 'Discord'],
      cfg: {
        DiscordWSS: Discord.WSS,
        Discord: Discord.m,
        TG: Telegram.m
      }
    },
    msg: {
      templates: {// Шаблоны сообщений
        news: news,
        updates: updates,
        feeds: feeds
      },
      data: {}
    }
  }
});