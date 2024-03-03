export function check(o){
  console.log('[Check]');
  // console.log(o);
  if(!o.arr) return [];
  const index = o.arr.findIndex(e => e.time === o.id?.lastFeed?.id
  );
  // console.log(index);
  // console.log(`CC ${o.id?.lastFeed?.id}`);

  if(index > -1){
    console.log('[Check] Last feed founded:', index);
    console.log('FEED', o.arr[index]);
    o.arr.splice(0, index+1);
    // else return [];
  }else{
    console.log('[Check] Last feed not founded');
  }
  return o.arr;
};