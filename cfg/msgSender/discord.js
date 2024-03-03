export const Discord = {
  WSS: {// Discord WSS
    guildsId: ['1207338107809042433'],
    channelsId: {// Каналы. Можно добавлять типы
      news: ['1207710517787885588'],
      updates: ['1207710607529484318'],
      feeds: ['1207710655990472915']
    },
    authorsId: ['1166002116096163872']
  },
  m: {
    run: 'msgSend',
    timer: 5000,
    getFrom: {
      Site: true,
      DiscordWSS: false
    },
    channelsId: {
      featured: ['1207338108543303742'],
      new: ['1207338108543303742'],
      news: ['1207338108543303742'],
      updates: ['1207338108543303742'],
      feeds: ['1207338108543303742']
    }
  }
}