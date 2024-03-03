import {Sequelize, DataTypes} from 'sequelize';
import {Db} from '../../../db/sql/mjs.js';
import {mf} from '../../../func/misc.js';
import {getFeeds} from './func/getFeeds.js';
import {msgSender} from '../../../senders/mjs.js';
import {m} from './func/mjs.js';

// import {readDb} from './readDb.js';
// import {check} from './func/mjs.js';

export async function init(o){
  console.log('[INIT]');

  await m.setTemplate({db:o.db});

  runner(o);
}

async function runner(o){
  console.log('[RUNNER] Started');

  for await (let e of o.fetch.hub.links){
    await mf.wait(o.fetch.hub.timer);
    // o.feeds = await getFeeds({url:e.link});
    const list = m.check({
      arr: (await getFeeds({url:e.link}))?.reverse(),
      id: await m.readDb({db:o.db, channel:e.name}),
      channel: e.name
    });
    // console.log('LIST', list);
    if(!list.length > 0) continue;
    const r = await m.sendFeed({
      db: o.db,
      builder:o.builder,
      ch:{
        name:e.name,
        type:e.type
      },
      feeds:list
    });
    console.log(r);
    // await updateDb({db:o.db, ...r});
  };

  console.log('[RUNNER] Success');
  if(o.fetch.hub.rerun.on){
    console.log(`[RUNNER] rerun ${o.fetch.hub.rerun.on} : ${o.fetch.hub.rerun.timer}`);
    setTimeout(() => {
      runner(o);
    }, o.fetch.hub.rerun.timer);
  };

  // o.feedsList = check({arr: await getFeeds({url:e.link})?.reverse(), id:id});

  // console.log('New feeds founded:', o.feedsList.length);
  // o.feeds = await getFeeds({links:o.fetch.hub.links, timer:o.fetch.hub.timer});

  // if(!o.feeds){
  //   console.log('[RUNNER] Error, no feeds');
  //   return;
  // }

  // console.log(o.feeds);

  // for await (let l of o.feeds){
  //   await run({builder:o.builder, feeds:l});
  // }
};

// function send(o){
//   console.log('[Send]');
//   return new Promise(async (result, error) => {
//     let data;
//     for await (let feed of o.feeds){
//       const msg = misc.cfgMsg({
//         ch: o.ch,
//         feed: feed
//       });
//       // console.log(msg);
//       // data = await msgSender({
//       //   app:'Site',
//       //   builder:o.builder,
//       //   data:msg,
//       //   lastId:feed.time
//       // });
//       await updateDb({db:o.db, lastId:feed.time, ch:o.ch});
//     };

//     result({...data, ch:o.ch});
//     // const msg = misc.cfgMsg({
//     //   ch: {
//     //     name:o.feeds.name,
//     //     type:o.feeds.type
//     //   },
//     //   feed: o.feeds.list[0]
//     // });
//     // console.log(msg);
//   })
// }

// async function updateDb(o){
//   console.log('[Update]');
//   return await Db.addOrUpdate({
//     db: o.db,
//     name: 'WSS',
//     target: {
//       where: {
//         channel: o.ch.name
//       }
//     },
//     data: {
//       channel: o.ch.name,
//       lastFeed: {
//         id: o.lastId
//       }
//     }
//   }).then(
//     r => console.log('DB updated!')
//   )
// }