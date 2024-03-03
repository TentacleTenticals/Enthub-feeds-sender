export const misc = {
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
  }
}