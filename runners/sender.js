import {jsDom} from '../scraping/jsdom.js';
import {cheer} from '../scraping/cheerio.js';
// import {wssServer} from '../ws/server.js';
// import {wssConnect} from '../ws/client.js';
import {Sequelize, DataTypes} from 'sequelize';
import {Db} from '../db/sql/mjs.js';
import {mf} from '../func/html.js';

import {msgSender} from '../func/msgSender.js';

async function getFeeds(o){
  console.log('[GetFeeds]');
  const res = await jsDom({url:o.url});
  const dom = res.dom.querySelectorAll(`main .mb-5>[x-data]`);
  const arr = [];

  dom.forEach(e => {
    arr.push(res.getFeed(e));
  });

  return arr;
};

async function readDb(o){
  await Db.set({
    db: o.db,
    name: 'WSS',
    sync: true,
    model: {
      lastFeed: {
        type: DataTypes.JSON
      },
      lastComment: {
        type: DataTypes.JSON
      }
    },
    cfg: {}
  });
  return (await Db.find({
    db: o.db,
    model: 'WSS',
    target: {
      where: {
        id: '1'
      }
    }
  })).res?.dataValues;
}

function check(o){
  console.log('[Check]', o.id);
  const index = o.arr.findIndex(e => e.header.time === o.id?.lastFeed.id);

  if(index && index !== -1){
    console.log('[Check] Last feed founded:', index);
    console.log('FEED', o.arr[index])
    o.arr.splice(0, index+1);
  }else{
    console.log('[Check] Last feed not founded');
  }
  return o.arr;
}

export async function run(o){
  console.log('QQ', o.builder)
  console.log(`[RUN] Started... ${new Date()}`);
  // const db = await Db.connect({
  //   dialect: 'sqlite',
  //   storage: './db/sql/database.sqlite',
  //   logging: false
  // });
  const feeds = await getFeeds({
    url: o.url,
    timer: o.timer
  }),
    id = await readDb({db:o.db});

  // console.log(feeds)

  o.feedsList = check({arr: feeds?.reverse(), id:id});

  console.log('New feeds founded:', o.feedsList.length);
  // console.log('New feeds founded:', o.feedsList[o.feedsList.length-1]);

  // msgSender({app:'Site', builder:o.builder, data:m});

  sender({
    db: o.db,
    builder: o.builder,
    feeds: o.feedsList,
    url: o.url,
    rerun: o.rerun,
    timer: o.timer,
    savedId: o.id
  });
}

function sender(o){
  function msg(feed){
    return {
      author: feed.header.author,
      msg: {
        text: feed.content.title,
        link: feed.url,
        attachments: feed.content.attachments,
        chType: 'feeds'
      }
    };
  };
  
  function test(q){
    return new Promise((res, err) => {
      if(q){
        o.lastId = q.header.time;
        res({app:'[Sender]', status:'success', data:q, lastId:o.lastId});
      }
      else err({app:'[Sender]', status:'fail', data:q, lastId:o.lastId});
    })
  };
  const promises = [];

  o.feeds.forEach(e => {
    promises.push(
      msgSender({app:'Site', builder:o.builder, data:msg(e), lastId:e.header.time})
      // test(e).then(
      //   res => {
      //     // console.log(res);
      //     return res;
      //   }
      // )
    );
  })

  if(promises.length > 0) Promise.all(promises).then(
    async result => {
      console.log(`[RUN] Fully completed, rerun is ${o.rerun}, timer ${o.timer}`);
      // console.log('R', result)
      {
        await Db.addOrUpdate({
          db: o.db,
          model: 'WSS',
          target: {
            where: {
              id: '1'
            }
          },
          data: {
            lastFeed: {
              id: result[result.length-1].lastId
            }
          }
        }).then(
          r => console.log(r)
        )
      }
      // console.log('[RUN] Restart will be...', o.timer);
      if(o.rerun) setTimeout(() => {
        run({db:db, url:o.url, builder:o.builder, timer:o.timer, rerun:o.rerun});
      }, o.timer);
      // 'writeToDb';
    },
    async error => {
      console.log('[RUN] Error on complete', error);
      {
        await Db.addOrUpdate({
          db: o.db,
          model: 'WSS',
          target: {
            where: {
              id: '1'
            }
          },
          data: {
            lastFeed: {
              id: error.lastId
            }
          }
        });
      }
    }
  )
  else{
    console.log('[RUN] No send');
    if(o.rerun) setTimeout(() => {
      run({db:db, url:o.url, builder:o.builder, timer:o.timer, rerun:o.rerun});
    }, o.timer);
  }
}