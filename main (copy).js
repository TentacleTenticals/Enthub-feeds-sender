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

import {connectDD} from './apps/discord/wss.js';

import {run} from './runners/sender.js';

const ent = 'https://enthub.it/featured';
const rssLink = 'https://politepol.com/fd/M11xtPVRQNyo.xml';

// Запуск главной функции
async function start(o){
  console.log('[START]');

  // Проверять дискорд на новые сообщения
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
  
  // Подключение базы данных
  const db = await Db.connect({
    dialect: 'sqlite',
    storage: './db/sql/database.sqlite',
    // logging: false
  });

  // Запуск поиска новых фидов на сайте
  o.fetch.hub && run({
    url: 'https://enthub.it/featured',
    rerun: false,
    timer: 10000,
    db: db,
    builder: o.builder,
    msg: o.msg
  });
};

start({
  fetch: {
    discord: true,
    hub: true
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
        feeds: feeds
      },
      data: {}
    }
  }
});