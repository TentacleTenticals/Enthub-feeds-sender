export const featured = {
  TG: {
    link: '',
    attachments: '',
    text: (o) => `Новый ${o.link && `[фид](${o.link})`||'фид\\!'}
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
    text: (o) => `Новый ${o.link ? `[фид](${o.link})`:'фид!'}
    ${o.text}`,
    embeds: (o) => ([{
      title: `Новый фид!`,
      decription: `${o.text}`
    }]),
    cfg: {
      text: true,
      delLinks: true,
      embeds: false
    }
  }
};