import {Tg} from '../apps/telegram/mjs.js';
import {Discord} from '../apps/discord/mjs.js';
import {msgBuilder} from './msgBuilder.js';

// function awaitPromiseAll(o){
//   const delay = t => new Promise(resolve => setTimeout(resolve, t));
//   o.promises = o.list.flatMap(async (e, i) => {
//     if(o.timer) await delay(i*o.timer);
//     return e;
//   });

//   return Promise.all(o.promises);
// }

function awaitPromiseAll(o){
  const delay = t => new Promise(resolve => setTimeout(resolve, t));
  o.promises = o.list.flatMap(async (e, i) => {
    if(o.timer) await delay(i*o.timer);
    return e;
  });

  return Promise.all(o.promises);
}

export function msgSender(o){
  return new Promise((mainRes, mainErr) => {
    console.log('[MSG Sender]', o);
    const promises = [];

    const apps = {
      TG: Tg,
      Discord: Discord
    };
    // const data = {};
    // Object.assign(data, o.data.msg);

    o.builder.apps.sendTo.forEach(e => {
      // const q = {
      //   ...o.appsCfg[e],
      //   [e]: {
      //     channelId: o.appsCfg[e].channelsId[o.msg.chType]
      //   }
      // }

      // apps[e]({app:e, data:{...o.apps.cfg[e], channelId:ch, msg:msgBulder({app:e, msg:o.msg})}})

      const data = structuredClone(o.data.msg);
      // Object.assign(data, o.data.msg);


      o.builder.apps.cfg[e].channelsId[o.data.msg.chType].forEach(async ch => {
        if(o.timer) await delay(ch*o.builder.timer);
        if(o.builder.apps.cfg[e].getFrom[o.app]) promises.push(
          // o.promises = o.list.flatMap(async (e, i) => {
          // if(o.timer) await delay(ch*o.builder.timer);
          await apps[e]({
            app:e,
            timer: o.builder.timer,
            data:{
              ...o.builder.apps.cfg[e],
              channelId:ch,
              msg:msgBuilder({app:e, msg:data, templates:o.builder.msg.templates})
            }
          }).then(
            res => console.log(`[${res.app}] ${res.process} ${res.status}`, res.data),
            err => console.log(`[${res.app}] ${res.process} ${res.status}`, res.data)
          )
        )
      })

      // promises.push(
      //   apps[e]({...o, app:e, ...o.msg, channelId: o.appsCfg[e].channelsId[o.msg.chType]})
      // )
    })

    console.log(`[Sender] Запущен! Будет отправлено в ${promises.length} приложений.`);

    Promise.all(promises).then(
      result => {
        console.log('[Sender] Завершено!!!');
        mainRes({app:'[Sender]', result:'success', lastId:o.lastId, res:result});
      },
      error => {
        console.log('[Sender] Ошибка!!!');
        mainErr({app:'[Sender]', result:'fail', lastIdl:o.lastId, err:error});
      }
    )
  })
}