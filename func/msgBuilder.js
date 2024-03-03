// import {sender} from './sender.js';

export function msgBuilder(o){
  console.log('[MSG Builder]');
  const filters = {
    linkGet: /(http[s]*:\/\/[^ ]+)/gm,
    main: false
  }

  const r = {
    fs: {
      TG: /([_\*\[\]()~\`>#+=\|{}.!]-)/gmi,
      Discord: /([\*\[\]()~\`>#\|]-)/gmi,
      linkCheck: /(http[s]*:\/\/[^ ]+)/gmi,
      main: false
    },
    getLink: function(text){
      if(o.msg.link) return;
      if(text.match(this.fs.linkCheck)) text.replace(this.fs.linkCheck, (def, link) => {
        o.msg.link = link;
      })
    },
    clearText: function(text){
      return text.replace(this.fs[o.app], '\\$1');
    },
    delLinks: function(text){
      return text.replace(this.fs.linkCheck, '');
    }
  }

  r.getLink(o.msg.text);

  // function replace(o){
  //   return o.text.replace(o.filter, '\\$1')
  // }
  o.msg.cfg = o.templates[o.msg.chType][o.app].cfg;
  switch(o.app){
    case 'TG':
      o.msg.defText = o.msg.text;
      o.msg.text = o.templates[o.msg.chType][o.app].text({
        link:o.msg.link,
        text:r.clearText(o.msg.cfg.delLinks && r.delLinks(o.msg.text)||o.msg.text)
      });
      o.msg.buttons = o.msg.cfg.buttons && o.templates[o.msg.chType][o.app].buttons({
        url:o.msg.link
      })||[];

      return o.msg;
    break;
    case 'Discord':
      o.msg.defText = o.msg.text;
      o.msg.text = o.templates[o.msg.chType][o.app].text({
        link:o.msg.link,
        text:r.clearText(o.msg.cfg.delLinks && r.delLinks(o.msg.text)||o.msg.text)
      });
      o.msg.embeds = o.templates[o.msg.chType][o.app].embeds({
        link:o.msg.link,
        text:o.msg.cfg.delLinks && r.delLinks(o.msg.defText)
      });

      // console.log('[MSG Builder2]', o);

      return o.msg;
    break;
  }
}
