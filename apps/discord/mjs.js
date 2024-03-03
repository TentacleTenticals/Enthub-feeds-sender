import axios from 'axios';

export async function Discord(o){
  console.log('[Discord]');
  if(o.timer) await new Promise(resolve => setTimeout(resolve, o.timer));
  switch(o.data.run){
    case 'msgSend':
      o.type = `channels/${o.data.channelId}/messages`;
      o.method = 'POST';
      o.d = {
        content: o.data.msg.cfg.text ? o.data.msg.text:'',
        attachments: o.data.msg.attachments,
        embeds: o.data.msg.cfg.embeds ? o.data.msg.embeds:[],
        sticker_ids: o.data.msg.stickers,
        allowed_mentions: o.data.msg.mentions,
      }
    break;
    case 'addForum':
      o.type = `channels/${o.data.channelId}/threads`;
      o.method = 'POST';
      o.d = {
        name: o.data.name,
        message: {
          content: o.data.msg.text,
          attachments: o.data.msg.attachments,
          embeds: o.data.msg.embeds,
          sticker_ids: o.data.msg.stickers,
          allowed_mentions: o.data.msg.mentions,
        },
        applied_tags: o.data.msg.tags
      }
    break;
  }
  return axios(`https://discord.com/api/v10/${o.type}`, {
    headers: {
      Authorization: `Bot ${process.env['discordToken']}`
    },
      method: o.method,
      data: o.d
    }).then(
      res => ({status:'success', process:'send', app:'Discord', data:res.data}),
      err => ({status:'error', process:'send', app:'Discord', data:JSON.stringify(err.response.data)})
    )
};