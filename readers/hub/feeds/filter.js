export function filter(o){
  console.log('[Check]', o.id);
  const index = o.arr.findIndex(e => e.header.time === o.id?.lastFeed.id);

  if(index && index !== -1){
    console.log('[Check] Last feed founded:', index);
    console.log('FEED', o.arr[index])
    o.arr.splice(0, index+1);
  }else{
    console.log('[Check] Last feed not founded');
  }
  return o.arr;
};