import {rss} from './scraping/jsdom.js';
import {cheer} from './scraping/cheerio.js';
import {wssServer} from './ws/server.js';
import {wssConnect} from './ws/client.js';
import {Sequelize, DataTypes} from 'sequelize';
import {Db} from './db/sql/mjs.js';
import {mf} from './func/html.js';

// import {pup} from './scraping/pup.js';

const ent = 'https://enthub.it/featured';
const rssLink = 'https://politepol.com/fd/M11xtPVRQNyo.xml';

// cheer({
//   url: ent
// }).then(
//   res => {
//     const $ = res.$;
//     // console.log(res[0]);

//     const mf = {
//       sel: function(o){
//         const el = o.el.find(o.q);
//         if(!o.text) return el;
//         else
//         return el.text()?.trim();
//       },
//       nth: function(n){
//         return `:nth-child(${n})`
//       },
//       text: function(o){
//         return o.textContent?.trim();
//       },
//       toMS: function(o){
//         if(!o) return;
//         return Date.parse(o);
//       }
//     }

//     const dom = $(`main .mb-5>[x-data]`)[0];
//     // dom.each((e, el) => {
//     //   console.log(res(el).find('a'))
//     // })
//     // res.getFeed()

//     console.log(res.getFeed(dom))
//   }
// )

// rss({url:ent}).then(
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

// const server = wss({port:8080});
// const socket = wsConnect({
//   port:8080,
//   url:'wss://9dd12be0-f9b9-4291-80d2-997180af93b5-00-4oim5uvshzrx.pike.replit.dev/'
// });

// socket.onopen = (e) => {
//   console.log("Connect");
// };
// socket.onmessage = (e) => {
//   // console.log(e.data.toString());
//   console.log(JSON.parse(e.data));
// };


// wss({port:8080}).then(
//   res => {
//     const s = (m) => res.wss.send(JSON.stringify(m));

//     s({msg:'Yo!'});
//   }
// )

// const db = Db.connect({
//   dialect: 'sqlite',
//   storage: './db/sql/database.sqlite'
// }).then(
//   res => {
//     console.log('Connected');

//     Db.set({
//       db: res,
//       name: 'User',
//       sync: true,
//       model: {
//         name: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//         role: {
//           type: DataTypes.STRING
//         }
//       },
//       cfg: {}
//     })

//     console.log(res.models);

//     res.models.User.build({ name:'Jane', role:'Programmer' }).save().then(
//       r => {
//         console.log('[DB] Build');

//         console.log(res.models.User.find())
//       }
//     );
//   },
//   err => console.error('Connection error', err)
// );

async function run(){
  return await Db.connect({
    dialect: 'sqlite',
    storage: './db/sql/database.sqlite'
  });
};

(async () => {
  console.log('[RUN]');
  const db = await run();

  // console.log(db);
  await Db.set({
    db: db,
    name: 'Feeds',
    sync: true,
    model: {
      // time: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      header: {
        type: DataTypes.JSON
      },
      content: {
        type: DataTypes.JSON
      }
    },
    cfg: {}
  });

  // console.log(await db.models.Feeds.findAll())

  // await Db.write({
  //   db: db,
  //   model: 'Feeds',
  //   data: {
  //     title: 'Enthub',
  //     time: new Date().getTime(),
  //     url: 'url?'
  //   }
  // });

  // rss({url:ent}).then(
  //   async res => {
  //     const dom = res.dom.querySelectorAll(`main .mb-5>[x-data]`);
  //     const arr = [];

  //     // for(let i = 0, len = dom.length; i < len; i++){
  //     //   arr.push(res.getFeed(dom[i]));
  //     // }

  //     dom.forEach(e => {
  //       arr.push(res.getFeed(e));
  //     });

  //     console.log(arr);

  //     await Db.writeMany({
  //       db: db,
  //       model: 'Feeds',
  //       data: arr
  //     });

  //     Db.findAll({
  //       db: db,
  //       model: 'Feeds',
  //       find: {
  //         // where: {
  //         //   title: 'Enthub'
  //         // }
  //       }
  //     }).then(
  //       res => console.log('[DB] Result', res)
  //     );

  //     // console.log(getFeed(dom));
  //   }
  // )

  Db.find({
    db: db,
    model: 'Feeds',
    find: {
      // where: {
      //   title: 'Enthub'
      // }
    }
  }).then(
    res => console.log('[DB] Result', res)
  );

  // db.models.Feeds.build({
  //   title:'Test',
  //   time:'some1',
  //   url:'some url'
  // }).save().then(
  //   async r => {
  //     console.log('[DB] Build');

  //     console.log(await db.models.Feeds.findAll())
  //   }
  // );

  
})();

// pup({
//   url: 'https://enthub.it/featured'
// }).then(
//   res => {
//     console.log(res);
//   },
//   err => {
//     console.log(err);
//   }
// )