import {Sequelize, DataTypes} from 'sequelize';
import {Db} from '../../../../db/sql/mjs.js';
import {msgSender} from '../../../../senders/mjs.js';

export const m = {
  setTemplate: async function(o){
    return await Db.set({
      db: o.db,
      name: 'WSS',
      sync: true,
      data: {
        channel: {
          type: DataTypes.STRING,
          allowNull: false
        },
        lastFeed: {
          type: DataTypes.JSON
        }
      },
      cfg: {}
    });
  },
  readDb: async function readDb(o){
    // console.log('READ', o)
    return (await Db.find({
      db: o.db,
      name: 'WSS',
      target: {
        where: {
          channel: o.channel
        }
      }
    })).res?.dataValues;
  },
  updateDb: async function(o){
    console.log('[Update]');
    return await Db.addOrUpdate({
      db: o.db,
      name: 'WSS',
      target: {
        where: {
          channel: o.ch.name
        }
      },
      data: {
        channel: o.ch.name,
        lastFeed: {
          id: o.lastId
        }
      }
    }).then(
      r => console.log('DB updated!')
    )
  },
  check: function(o){
    console.log('[Check]');
    // console.log(o);
    if(!o.arr) return [];
    const index = o.arr.findIndex(e => e.time === o.id?.lastFeed?.id
    );
    // console.log(index);
    // console.log(`CC ${o.id?.lastFeed?.id}`);

    if(index > -1){
      console.log('[Check] Last feed founded:', index);
      console.log('FEED', o.arr[index]);
      o.arr.splice(0, index+1);
      // else return [];
    }else{
      console.log('[Check] Last feed not founded');
    }
    return o.arr;
  },
  cfgMsg: function(o){
    return {
      author: o.feed.author,
      subsite: o.feed.subsite,
      msg: {
        text: o.feed.content.title,
        link: o.feed.url,
        attachments: o.feed.content.attachments,
        chType: o.ch.name
      }
    }
  },
  sendFeed: function (o){
    console.log('[SendFeed]');
    return new Promise(async (result, error) => {
      let data;
      for await (let feed of o.feeds){
        const msg = this.cfgMsg({
          ch: o.ch,
          feed: feed
        });
        // console.log(msg);
        data = await msgSender({
          app:'Site',
          builder:o.builder,
          data:msg,
          lastId:feed.time
        });
        await this.updateDb({db:o.db, lastId:feed.time, ch:o.ch});
      };

      result({...data, ch:o.ch});
      // const msg = misc.cfgMsg({
      //   ch: {
      //     name:o.feeds.name,
      //     type:o.feeds.type
      //   },
      //   feed: o.feeds.list[0]
      // });
      // console.log(msg);
    })
  }
}