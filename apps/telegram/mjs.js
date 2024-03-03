import axios from 'axios';

export async function Tg(o){
  console.log('[TG]');
  if(o.timer) await new Promise(resolve => setTimeout(resolve, o.timer));
  switch(o.data.run){
    case 'msgSend':
      o.type = 'sendMessage';
      o.method = 'POST';
      o.d = {
        chat_id: o.data.chatId,
        message_thread_id: o.data.channelId,
        parse_mode: 'MarkdownV2',
        text: o.data.msg.text,
        reply_markup: {
          inline_keyboard: o.data.msg.buttons,
        }
      }
    break;
  }
  return axios(`https://api.telegram.org/bot${process.env['telegramToken']}/${o.type}`, {
      method: o.method,
      data: o.d
    }).then(
      res => ({status:'success', process:'send', app:'TG', data:res.data}),
      err => ({status:'error', process:'send', app:'TG', data:err.response.data})
    )
};