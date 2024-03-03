import axios from 'axios';
import {JSDOM} from 'jsdom';
import {mf} from '../func/html.js';

export function jsDom(o){
  return axios(o.url, {
    method: 'GET'
  }).then(
    res => {
      // console.log(res.data)

      // console.log('DOM', dom);

      const dom = new JSDOM(res.data);

      return {app:'[JsDOM]', status:'success', data:{getFeed:getFeed, dom:dom.window.document}};
    },
    err => ({app:'[JsDOM]', status:'fail'})
  )
};

function getFeed(dom){
  const h = mf.sel({el:dom, q:`${mf.nth(2)}`}),
    subLen = mf.sel({el:h, q:`${mf.nth(2)}>${mf.nth(2)}`}).children?.length;
  return {
    author: mf.sel({el:h, q:`${mf.nth(2)}>${mf.nth(1)}>*`, text:true}),
    subsite: (() => subLen > 1 && mf.sel({el:h, q:`${mf.nth(2)}>${mf.nth(2)}>${mf.nth(1)}`, text:true})
      )(),
    time: (() => mf.toMS(mf.sel({el:h, q:`${mf.nth(2)}>${mf.nth(2)}>${mf.nth(subLen > 1 ? 2 : 1)}`})?.getAttribute('datetime'))
      )(),
    url: mf.sel({el:dom, q:`h2 a`}).href,
    content: {
      title: mf.sel({el:dom, q:`h2 a`, text:true}),
      img: (() => {
        const i = mf.sel({el:dom, q:`${mf.nth(4)}>*`});
        if(i.tagName === 'IMG'){
          return {
            url: i.src
          }
        }
      })()
    }
  };
};