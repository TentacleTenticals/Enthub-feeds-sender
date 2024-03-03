import 'dotenv/config';
import {jsDom} from './scraping/jsdom.js';
import {cheer} from './scraping/cheerio.js';
// import {wssServer} from './ws/server.js';
// import {wssConnect} from './ws/client.js';
// import {ioServer} from './ws/io/server.js';
// import {ioClient} from './ws/io/client.js';
import {Sequelize, DataTypes} from 'sequelize';
import {Db} from './db/sql/mjs.js';
import {mf} from './func/html.js';

import {Discord} from './cfg/msgSender/discord.js';
import {Telegram} from './cfg/msgSender/telegram.js';
import {feeds} from './cfg/msgSender/templates/feeds.js';
import {news} from './cfg/msgSender/templates/news.js';
import {updates} from './cfg/msgSender/templates/updates.js';
import {featured} from './cfg/msgSender/templates/featured.js';
import {newT} from './cfg/msgSender/templates/new.js';

import {connectDD} from './apps/discord/wss.js';

import {init} from './readers/hub/feeds/mjs.js';

const ent = 'https://enthub.it/featured';
const rssLink = 'https://politepol.com/fd/M11xtPVRQNyo.xml';

// Запуск главной функции
async function start(o){
  console.log('[START]');

  // Discord WSS. Отправка сообщений дискорда в TG/...
  o.fetch.discord && connectDD({
    ss: {},
    que: {
      d: {
        token: process.env['discordToken'],
        intents: 3276799,
        properties: {
           $os: "linux",
           $browser: "chrome",
           $device: "chrome",
        }
      }
    },
    builder: o.builder,
    msg: o.msg
  });

  // Подключение базы данных. Необходима
  const db = await Db.connect({
    dialect: 'sqlite',
    storage: './db/sql/database.sqlite',
    logging: false
  });

  // Запуск поиска новых фидов на сайте
  o.fetch.hub.on && init({
    db: db,
    fetch: o.fetch,
    builder: o.builder,
    msg: o.msg
  });
};

start({
  fetch: {
    discord: true,
    hub: {
      on: true,
      timer: 5000,
      rerun: {
        on: true,
        timer: 50000
      },
      links: [
        {
          name: 'featured',
          type: 'tab',
          chType: 'feeds',
          link: 'https://enthub.it/featured'
        },
        {
          name: 'new',
          type: 'tab',
          chType: 'feeds',
          link: 'https://enthub.it/'
        }
      ]
    }
  },
  builder: {
    timer: 10000,
    apps: {
      sendTo: ['TG', 'Discord'],
      cfg: {
        Site: {
          getFrom: {
            Site: true
          }
        },
        DiscordWSS: Discord.WSS,
        Discord: Discord.m,
        TG: Telegram.m
      }
    },
    msg: {
      templates: {// Шаблоны сообщений
        news: news,
        updates: updates,
        feeds: feeds,
        featured: featured,
        new: newT
      },
      data: {}
    }
  }
});

// (async () => {
//   const db = await Db.connect({
//     dialect: 'sqlite',
//     storage: './db/sql/database.sqlite',
//     logging: false
//   });

//   await Db.set({
//     db: db,
//     name: 'WSS',
//     sync: true,
//     data: {
//       channel: {
//         type: DataTypes.STRING,
//         allowNull: false
//       },
//       lastFeed: {
//         type: DataTypes.JSON
//       }
//     },
//     cfg: {}
//   });

//   // Db.addOrUpdate({
//   //   db: db,
//   //   name: 'WSS',
//   //   target: {
//   //     where: {
//   //       channel: 'wixx'
//   //     }
//   //   },
//   //   data: {
//   //     channel: 'wixx',
//   //     lastFeed: {
//   //       id: 'o.lastId'
//   //     }
//   //   }
//   // }).then(
//   //   r => console.log('DB updated!')
//   // )

//   Db.findMany({
//     db: db,
//     name: 'WSS',
//     target: {
//       // where: {
//       //   channel: 'wixx'
//       // }
//     }
//   }).then(
//     r => console.log(r.res)
//   )
// })();