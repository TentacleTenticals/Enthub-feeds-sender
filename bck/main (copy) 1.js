import {jsDom} from './scraping/jsdom.js';
import {cheer} from './scraping/cheerio.js';
import {wssServer} from './ws/server.js';
import {wssConnect} from './ws/client.js';
import {ioServer} from './ws/io/server.js';
import {ioClient} from './ws/io/client.js';
import {Sequelize, DataTypes} from 'sequelize';
import {Db} from './db/sql/mjs.js';
import {mf} from './func/html.js';

import {run} from './runners/sender.js';

// import {pup} from './scraping/pup.js';

const ent = 'https://enthub.it/featured';
const rssLink = 'https://politepol.com/fd/M11xtPVRQNyo.xml';

async function start(){
  console.log('[START]');
  const db = await Db.connect({
    dialect: 'sqlite',
    storage: './db/sql/database.sqlite',
    // logging: false
  });

  run({
    url: 'https://enthub.it/featured',
    rerun: false,
    timer: 10000,
    db: db
  });
};

// start();

async function wax(){
  const db = await Db.connect({
    dialect: 'sqlite',
    storage: './db/sql/database.sqlite',
    logging: false
  });

  await Db.set({
    db: db,
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

  // await Db.set({
  //   db: db,
  //   name: 'Feeds',
  //   sync: true,
  //   model: {
  //     header: {
  //       type: DataTypes.JSON
  //     },
  //     content: {
  //       type: DataTypes.JSON
  //     }
  //   },
  //   cfg: {}
  // });

  // Db.find({
  //   db: db,
  //   model: 'Feeds',
  //   target: {
  //     where: {
  //       id: '1'
  //     }
  //   }
  // }).then(
  //   res => console.log(res)
  // )

  // Db.write({
  //   db: db,
  //   model: 'WSS',
  //   data: {
  //     lastFeed: {
  //       id: 'lol'
  //     }
  //   }
  // }).then(
  //   res => console.log(res)
  // )

  Db.find({
    db: db,
    model: 'WSS',
    target: {
      // where: {
      //   header: {
      //     title: 'lol'
      //   }
      // }
    }
  }).then(
    res => console.log(res.res.dataValues)
  )

  // Db.addOrUpdate({
  //   db: db,
  //   model: 'Feeds',
  //   target: {
  //     where: {
  //       header: {
  //         title: 'Wax'
  //       }
  //     }
  //   },
  //   data: {
  //     header: {
  //       title: 'Fix'
  //     }
  //   }
  // }).then(
  //   res => console.log('[DB] Result', res)
  // );
}

// wax();



// jsDom({url:ent}).then(
//   res => {
//     const dom = res.dom.querySelectorAll(`main .mb-5>[x-data]`);
//     const arr = [];

//     // for(let i = 0, len = dom.length; i < len; i++){
//     //   arr.push(res.getFeed(dom[i]));
//     // }

//     dom.forEach(e => {
//       arr.push(res.getFeed(e));
//     });

//     console.log(arr);

//     // console.log(getFeed(dom));
//   }
// )

async function qq(){
  const server = wssServer({
    port:8080
  }).then(
    res => console.log('lol')
  )

  // wssConnect({
  //   port:8080
  // })

  // console.log('s', server.ws);
};

// qq()

ioServer({
  port: 8080
})

const io = ioClient({
  port: 8080
})

io.emit('newFeed', 'qq')