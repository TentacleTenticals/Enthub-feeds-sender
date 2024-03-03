import {Tg} from '../apps/telegram/mjs.js';
import {Discord} from '../apps/discord/mjs.js';
import {msgBuilder} from './msgBuilder.js';
import {mf} from '../func/misc.js';

export function msgSender(o){
  return new Promise(async (mainRes, mainErr) => {
    console.log('[MSG Sender]', o);
    const promises = [];

    const apps = {
      TG: Tg,
      Discord: Discord
    };
    // const data = {};
    // Object.assign(data, o.data.msg);
    for await (let app of o.builder.apps.sendTo){
      console.log(app);

      for await (let ch of o.builder.apps.cfg[app].channelsId[o.data.msg.chType]){
        await mf.wait(o.builder.apps.cfg[app].timer);
        console.log(ch);

        if(o.builder.apps.cfg[app].getFrom[o.app]) await apps[app]({
          app:app,
          data:{
            ...o.builder.apps.cfg[app],
            channelId:ch,
            msg:msgBuilder({app:app, msg:structuredClone(o.data.msg), templates:o.builder.msg.templates})
          }
        }).then(
          res => console.log(`[${res.app}] ${res.process} ${res.status}`, res.data),
          err => console.log(`[${res.app}] ${res.process} ${res.status}`, res.data)
        )
      }
    }

    // console.log(`[Sender] Запущен! Будет отправлено в ${promises.length} приложений.`);

    Promise.all(promises).then(
      result => {
        console.log('[Sender] Завершено!!!');
        return mainRes({app:'[Sender]', result:'success', data: {lastId:o.lastId}});
      },
      error => {
        console.log('[Sender] Ошибка!!!');
        return mainErr({app:'[Sender]', result:'fail', data:{lastId:o.lastId}, err:error});
      }
    )
  })
}