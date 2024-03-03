import axios from 'axios';
import cheerio from 'cheerio';
import {mf} from '../func/html.js';

export function cheer(o){
  return axios(o.url, {
    method: 'GET'
  }).then(
    res => {
      const $ = cheerio.load(res.data, {xmlMode: false});
      function getFeed(dom){
        const h = $(dom).find(`${mf.nth(2)}`),
        subLen = $(dom).find(`${mf.nth(2)}>${mf.nth(2)}`).children?.length;

        return {
          header: {
            time: mf.toMS($(h).find(`${mf.nth(2)}>${mf.nth(2)}>${mf.nth(subLen > 1 && 2||1)}`)?.attr().datetime),
            author: $(h).find(`${mf.nth(2)}>${mf.nth(1)}>*`).text().trim(),
            subsite: subLen > 1 && $(h).find(`${mf.nth(2)}>${mf.nth(2)}>${mf.nth(1)}`)?.text()?.trim(),
          },
          content: {
            title: $(h).find(`h2 a`)?.text().trim(),
            url: $(h).find(`h2 a`)?.attr().href,
            img: (() => {
              const i = $(dom).find(`${mf.nth(4)}>img`);
              // console.log(i.name);
              if(i){
                return {
                  url: i.attr()?.src
                }
              }
            })()
          }
        }
      }
      // const list = $(`main .mb-5>[x-data]`);

      return {$:$, getFeed:getFeed};

      // console.log(list.toArray());

      // $(`main .mb-5>[x-data]>h2`).get().map(x => {
      //   console.log(x).$('a')
      // })

      // list.each((e, el) => {
      //   const info = {
      //     url: $(el).find('h2 a')[0].attribs.href,
      //     author: $(el).find(':nth-child(1)>:nth-child(2) a').html().trim(),
      //     subsite: $(el).find(':nth-child(1)>:nth-child(2) a>:nth-child(1)').text().trim(),
      //     time: Date.parse($(el).find(':nth-child(2)>:nth-child(2) time')[0].attribs.datetime),
      //     content: {
      //       title: $(el).find('h2 a').text().trim(),
      //       img: (() => {
      //         const i = $(el).find(':nth-child(4)>*')[0];
      //         if(i.name === 'img'){
      //           return {
      //             url: i.attribs.src
      //           }
      //         }
      //       })()
      //     }
      //   };
      //   console.log(info)
      // })
      // $('description').textContent;
      // console.log(list)
    }
  )
};