export const PRODUCTS = [
  {id:'p01',name:'Everyday Backpack',category:'Everyday',price:6800,stock:8,color:'Navy',image:'backpack',description:'A compact everyday carry with room for your laptop and the little things.'},
  {id:'p02',name:'Studio Headphones',category:'Audio',price:8900,stock:5,color:'Charcoal',image:'headphones',description:'Over-ear comfort for focused mornings and your favorite playlists.'},
  {id:'p03',name:'Stoneware Mug',category:'Desk',price:1800,stock:12,color:'White',image:'mug',description:'A thoughtfully simple ceramic mug for your daily coffee ritual.'},
  {id:'p04',name:'Pocket Notebook',category:'Desk',price:1200,stock:20,color:'White',image:'notebook',description:'A place for small ideas, big plans, and everything in between.'},
  {id:'p05',name:'Insulated Bottle',category:'Everyday',price:3200,stock:6,color:'Forest',image:'bottle',description:'A reusable companion for your commute, your desk, and the outdoors.'},
  {id:'p06',name:'Desk Lamp',category:'Desk',price:5600,stock:0,color:'Charcoal',image:'lamp',description:'A quiet silhouette that brings a little more light to your workspace.'},
  {id:'p07',name:'Wireless Speaker',category:'Audio',price:7400,stock:4,color:'Black',image:'speaker',description:'Room-filling sound in an easy-to-place, portable format.'},
  {id:'p08',name:'Woven Handbag',category:'Everyday',price:2400,stock:15,color:'Amber',image:'tote',description:'A structured woven bag for market mornings and everyday errands.'}
];
export const ACCOUNT_EMAIL='alex@goodfinds.example';
export const ACCOUNT_PASSWORD='Test123!';
export function nextOrderId(orders){const highest=orders.reduce((max,order)=>Math.max(max,Number(/^GF-(\d+)$/.exec(order.id)?.[1])||0),0);return `GF-${String(highest+1).padStart(4,'0')}`;}
export const money=cents=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
export function normalizeCart(cart){
  if(!Array.isArray(cart))return [];
  const quantities=new Map();
  for(const row of cart){const p=PRODUCTS.find(p=>p.id===row?.id);if(p&&Number.isInteger(row.qty)&&row.qty>0)quantities.set(p.id,Math.min(p.stock,(quantities.get(p.id)||0)+row.qty));}
  return [...quantities].filter(([,qty])=>qty>0).map(([id,qty])=>({id,qty}));
}
export function calculate(cart,coupon=''){
  const clean=normalizeCart(cart);
  const subtotal=clean.reduce((n,row)=>n+PRODUCTS.find(p=>p.id===row.id).price*row.qty,0);
  const discount=coupon.toUpperCase()==='SAVE10'?Math.round(subtotal*.1):0;
  const shipping=!subtotal||subtotal-discount>=10000?0:600;
  const tax=Math.round((subtotal-discount)*.08);
  return {subtotal,discount,shipping,tax,total:subtotal-discount+shipping+tax,count:clean.reduce((n,r)=>n+r.qty,0)};
}
export function filterProducts({query='',category='All',sort='featured',inStock=false,maxPrice=100}={}){
  const q=query.trim().toLowerCase();
  const rows=PRODUCTS.filter(p=>(!q||`${p.name} ${p.category} ${p.color}`.toLowerCase().includes(q))&&(category==='All'||p.category===category)&&(!inStock||p.stock>0)&&p.price<=maxPrice*100);
  if(sort==='price-asc')rows.sort((a,b)=>a.price-b.price);
  if(sort==='price-desc')rows.sort((a,b)=>b.price-a.price);
  if(sort==='name')rows.sort((a,b)=>a.name.localeCompare(b.name));
  return rows;
}
export function validateCheckout(data){
  const errors={};
  if(!String(data.name||'').trim())errors.name='Enter your full name.';
  if(!isEmail(data.email))errors.email='Enter a valid email address.';
  if(String(data.address||'').trim().length<5)errors.address='Enter a street address with at least 5 characters.';
  if(!String(data.city||'').trim())errors.city='Enter your city.';
  if(!/^[A-Za-z0-9][A-Za-z0-9 -]{1,11}$/.test(String(data.postal||'').trim()))errors.postal='Enter a postal code with 2–12 letters or numbers.';
  if(!['US','GB','CA','TW','AU'].includes(data.country))errors.country='Choose a delivery country.';
  if(!data.agree)errors.agree='Please accept the terms of sale.';
  return errors;
}
export const isEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value||'').trim());
export const CONTACT_TOPICS={order:'An existing order',returns:'Returns and refunds',product:'A product question',other:'Something else'};
export function validateContact(data){
  const errors={};
  if(!String(data.name||'').trim())errors.name='Enter your name.';
  if(!isEmail(data.email))errors.email='Enter a valid email address.';
  if(!Object.hasOwn(CONTACT_TOPICS,data.topic||''))errors.topic='Choose a topic.';
  if(String(data.message||'').trim().length<10)errors.message='Write a message of at least 10 characters.';
  return errors;
}
