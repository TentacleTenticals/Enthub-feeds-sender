export const news = {
  TG: {
    link: '',
    attachments: '',
    text: (o) => `Новая ${o.link && `[новость](${o.link})`||'новость\\!'}
      ${o.text}`,
    buttons: (o) => [
      [{
        text: 'Ссылка',
        url: o.url
      }]
    ],
    cfg: {
      text: true,
      delLinks: true,
      embeds: false,
      buttons: true
    }
  },
  Discord: {
    link: '',
    attachments: '',
    text: (o) => `Новая ${o.link && `[новость](${o.link})`||'новость\\!'}
    ${o.text}`,
    embeds: (o) => ([{
      title: `Новая новость\\!`,
      decription: `${o.text}`
    }]),
    cfg: {
      text: true,
      delLinks: true,
      embeds: false
    }
  }
};