import Sequelize from 'sequelize';

export const Db = {
  connect: function (o){
    const db = new Sequelize({
      dialect: o.dialect,
      storage: o.storage,
      logging: o.logging
    });

    return db.authenticate().then(
      res => {
        console.log('Connected');
        return db;
      },
      err => console.error('Connection error: ', err)
    );
  },
  set: function(o){
    const d = o.db.define(
      o.name,
      o.data,
      o.cfg
    );
    if(o.sync) return d.sync();
    else
    return d;
  },
  find: function(o){
    return o.db.models[o.name].findOne(o.target).then(
      res => ({app:'[DB]', run:'find', status:'success', res:res}),
      err => ({app:'[DB]', run:'find', status:'error', err:err})
    );
  },
  findMany: function(o){
    return o.db.models[o.name].findAll(o.target).then(
      res => ({app:'[DB]', run:'findMany', status:'success', res:res}),
      err => ({app:'[DB]', run:'findMany', status:'error', err:err})
    );
  },
  write: function(o){
    return o.db.models[o.name].create(o.data).then(
      res => ({app:'[DB]', run:'write', status:'success', res:res}),
      err => ({app:'[DB]', run:'write', status:'error', err:err})
    );
  },
  writeMany: function(o){
    return o.db.models[o.name].bulkCreate(o.data).then(
      res => ({app:'[DB]', run:'writeMany', status:'success', res:res}),
      err => ({app:'[DB]', run:'writeMany', status:'error', err:err})
    );
  },
  update: function(o){
    return o.db.models[o.name].update(o.data, o.target).then(
      res => ({app:'[DB]', run:'update', status:'success', res:res}),
      err => ({app:'[DB]', run:'update', status:'error', err:err})
    );
  },
  addOrUpdate: function(o){
    return new Promise((result, error) => {
      Db.find({
        db: o.db,
        name: o.name,
        target: o.target
      }).then(
        s => {
          // console.log('[DB AddOrUpdate] Result', s);
          if(s.res === null){
            Db.write({
              db: o.db,
              name: o.name,
              data: o.data
            }).then(
              res => {
                result({app:'[DB AddOrUpdate]', run:'write', status:'success'});
              }
            )
          }else{
            // console.log('[DB AddOrUpdate] Founded', s);
            Db.update({
              db: o.db,
              name: o.name,
              target: o.target,
              data: o.data
            }).then(
              res => {
                result({app:'[DB AddOrUpdate]', run:'update', status:'success'});
              }
            )
          }
        }
      );
    })
  }
}