import {jsDom} from '../../../../scraping/jsdom.js';
import {mf} from '../../../../func/misc.js';

export async function getFeeds(o){
  console.log('[GetFeeds]');
  const res = await jsDom({url:o});
  const dom = res.data.dom.querySelectorAll(`main .mb-5>[x-data]`);
  const arr = [];

  dom.forEach(e => {
    arr.push(res.data.getFeed(e));
  });

  return arr;
};

export function qgetFeeds(o){
  console.log('[Get Feeds]');
  const feeds = [];
  return new Promise(async (res, err) => {
    // const i = -1;
    for await (let e of o.links){
      // i++;
      await mf.wait(o.timer);
      const feed = await getFeed(e.link);
      if(!feed||feed.status === 'fail') res();
      feeds.push({
        name:e.name,
        type:e.type,
        list:feed
      });
    };
    res(feeds);
  });
}