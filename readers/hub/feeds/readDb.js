import {Db} from '../../../db/sql/mjs.js';

export async function readDb(o){
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
}