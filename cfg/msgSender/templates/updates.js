export const updates = {
  TG: {
    link: '',
    attachments: '',
    text: (o) => `Новое ${o.link && `[обновление](${o.link})`||'обновление\\!'}
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
    text: (o) => `Новое ${o.link && `[обновление](${o.link})`||'обновление\\!'}
    ${o.text}`,
    embeds: (o) => ([{
      title: `Новое обновление\\!`,
      description: `${o.link && `[Ссылка](${o.link})`||''}
      ${o.text}`
    }]),
    cfg: {
      text: true,
      delLinks: true,
      embeds: false
    }
  }
};