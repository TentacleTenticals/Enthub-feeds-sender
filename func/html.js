export const mf = {
  sel: function(o){
    const el = o.el[o.q ? 'querySelector':'querySelectorAll'](o.q||o.qAll);
    if(!o.text) return el;
    else
    return el.textContent?.trim();
  },
  nth: function(n){
    return `:nth-child(${n})`
  },
  text: function(o){
    return o.textContent?.trim();
  },
  toMS: function(o){
    if(!o) return;
    return Date.parse(o);
  }
}