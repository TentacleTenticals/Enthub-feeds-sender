export const mf = {
  wait: function(timer){
    return new Promise(resolve => setTimeout(resolve, timer))
  }
};