import axios from 'axios';
import cheerio from 'cheerio';

export function rss(o){
  return axios(o.url, {
    method: 'GET'
  }).then(
    res => {
      // console.log(res.data)

      // console.log('DOM', dom);

      const $ = cheerio.load(res.data, {xmlMode: false});
      const list = $(`main .mb-5>[x-data]`);

      return list.toArray();

      console.log(list.length);

      // $(`main .mb-5>[x-data]>h2`).get().map(x => {
      //   console.log(x).$('a')
      // })

      list.each((e, el) => {
        const info = {
          url: $(el).find('h2 a')[0].attribs.href,
          author: $(el).find(':nth-child(1)>:nth-child(2) a').html().trim(),
          subsite: $(el).find(':nth-child(1)>:nth-child(2) a>:nth-child(1)').text().trim(),
          time: Date.parse($(el).find(':nth-child(2)>:nth-child(2) time')[0].attribs.datetime),
          content: {
            title: $(el).find('h2 a').text().trim(),
            img: (() => {
              const i = $(el).find(':nth-child(4)>*')[0];
              if(i.name === 'img'){
                return {
                  url: i.attribs.src
                }
              }
            })()
          }
        };
        console.log(info)
      })
      // $('description').textContent;
      // console.log(list)
    }
  )
};