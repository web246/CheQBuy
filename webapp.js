'use strict';

const products=[
  {id:'iphone',name:'iPhone 16 Pro',price:103071,origin:'China',category:'Electronics',image:'img/iphone.jpg',tag:'TECH FIND'},
  {id:'coffee',name:'Arabica Coffee Beans AA',price:877,origin:'Kenya',category:'Agricultural Products',image:'img/coffee.jpg',tag:'AFRICAN MADE'},
  {id:'pump',name:'Solar Water Pump 2HP',price:59340,origin:'India',category:'Machinery',image:'img/pump.jpg',tag:'SMART SOURCING'},
  {id:'kitenge',name:'Kitenge Cotton Fabric',price:581,origin:'Nigeria',category:'Fashion & Textiles',image:'img/kitenge.jpg',tag:'CULTURE & CRAFT'},
  {id:'sofa',name:'3-Seater Fabric Sofa',price:54180,origin:'China',category:'Home & Living',image:'img/sofa.jpg',tag:'HOME EDIT'},
  {id:'tea',name:'Kenyan Black Tea (CTC)',price:413,origin:'Kenya',category:'Agricultural Products',image:'img/tea.jpg',tag:'AFRICAN MADE'},
  {id:'galaxy',name:'Galaxy A55 5G',price:42441,origin:'China',category:'Electronics',image:'img/galaxy.jpg',tag:'TECH FIND'},
  {id:'leather',name:'Handmade Leather Bags',price:4902,origin:'Ethiopia',category:'Fashion & Textiles',image:'img/leather.jpg',tag:'MADE BY HAND'},
  {id:'generator',name:'Diesel Generator 10kVA',price:277350,origin:'Turkey',category:'Machinery',image:'img/generator.jpg',tag:'BUSINESS READY'},
  {id:'cookware',name:'Stainless Cookware Set',price:7800,origin:'China',category:'Home & Living',image:'img/cookware.jpg',tag:'HOME EDIT'},
  {id:'macm3',name:'MacBook Air 13" M3',price:135321,origin:'China',category:'Electronics',image:'img/macm3.jpg',tag:'TECH FIND'},
  {id:'fashion',name:'Everyday Style Edit',price:5810,origin:'Kenya',category:'Fashion & Textiles',image:'img/fashion.jpg',tag:'STYLE FIND'}
];
const promotions=[
  {kicker:'THE SMARTER WAY TO IMPORT',title:'Your next big idea<br>starts with a better source.',text:'Tell us what you need. We’ll find the right supplier and bring it to you.',image:'img/generator.jpg',alt:'Industrial goods ready for global shipping',link:'index.html#/contact',action:'Start sourcing'},
  {kicker:'AFRICAN GOODS, GLOBAL REACH',title:'Local treasures.<br>A world of buyers.',text:'Find beautiful goods from Africa and connect them with customers everywhere.',image:'img/kitenge.jpg',alt:'Colorful African kitenge textile',link:'index.html#/services',action:'Explore our services'},
  {kicker:'MOVE MORE. WORRY LESS.',title:'Your shipment has<br>a team behind it.',text:'Air, sea, customs and delivery — your trade journey, coordinated end to end.',image:'img/air.jpg',alt:'Cargo aircraft ready for an international shipment',link:'index.html#/calculator',action:'Plan a shipment'}
];
const productTrack=document.querySelector('#productTrack');
const shopGrid=document.querySelector('#shopGrid');
const formatPrice=value=>'KES '+new Intl.NumberFormat('en-KE',{maximumFractionDigits:0}).format(value);
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const views=[...document.querySelectorAll('.app-view')];
let activeView='home';
let homeCategory='All';
let shopCategory='All';
let shopQuery='';

function readCart(){
  try{
    const saved=JSON.parse(localStorage.getItem('cheqbuy-webapp-cart')||'[]');
    return Array.isArray(saved)?saved.filter(item=>products.some(product=>product.id===item.id)&&Number.isInteger(item.quantity)&&item.quantity>0):[];
  }catch(error){
    console.error('Unable to read the saved CheQBuy webapp cart.',error);
    return [];
  }
}
let cart=readCart();
function saveCart(){
  try{
    localStorage.setItem('cheqbuy-webapp-cart',JSON.stringify(cart));
  }catch(error){
    console.error('Unable to save the CheQBuy webapp cart.',error);
  }
  updateCart();
}
function productCard(product,allowAdd){
  return`<article class="product-card">
    <a href="index.html#/shop/${product.id}" aria-label="View ${product.name}">
      <div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy"><span class="product-tag">${product.tag}</span></div>
    </a>
    <div class="product-details"><span class="product-origin">${product.origin} · ${product.category}</span><h3>${product.name}</h3>
      <div class="product-bottom"><span class="product-price">${formatPrice(product.price)}</span>
      ${allowAdd?`<button class="product-link" type="button" data-add="${product.id}">Add to bag <span aria-hidden="true">+</span></button>`:`<a class="product-link" href="index.html#/shop/${product.id}">View find <span aria-hidden="true">↗</span></a>`}</div>
    </div>
  </article>`;
}
function renderHomeProducts(){
  const items=homeCategory==='All'?products:products.filter(product=>product.category===homeCategory);
  productTrack.innerHTML=items.map(product=>productCard(product,false)).join('');
}
function renderShop(){
  const items=products.filter(product=>(shopCategory==='All'||product.category===shopCategory)&&
    `${product.name} ${product.origin} ${product.category}`.toLowerCase().includes(shopQuery.toLowerCase()));
  shopGrid.innerHTML=items.map(product=>productCard(product,true)).join('')||
    '<div class="empty-state"><span>⌕</span><h2>No finds just yet</h2><p>Try another search or choose a different category.</p></div>';
  document.querySelector('#shopResultCount').textContent=`${items.length} ${items.length===1?'find':'finds'}`;
}
function renderCart(){
  const items=cart.map(item=>({...item,product:products.find(product=>product.id===item.id)}));
  const subtotal=items.reduce((sum,item)=>sum+item.product.price*item.quantity,0);
  const cartItems=document.querySelector('#cartItems');
  const cartSummary=document.querySelector('#cartSummary');
  if(!items.length){
    cartItems.innerHTML='<div class="empty-state"><span>◒</span><h2>Your bag is taking a breather.</h2><p>Find something you love and it will be waiting here.</p><button class="button button-dark" type="button" data-view="shop">Explore the shop <span aria-hidden="true">→</span></button></div>';
    cartSummary.innerHTML='<span class="section-kicker">ORDER SUMMARY</span><h2>Your next step</h2><p>Add an item to your bag to see your order summary. Freight and duty are quoted with our trade team.</p>';
    return;
  }
  cartItems.innerHTML=items.map(item=>`<article class="cart-row">
    <img src="${item.product.image}" alt="${item.product.name}">
    <div class="cart-row-info"><span>${item.product.origin} · ${item.product.category}</span><h2>${item.product.name}</h2><b>${formatPrice(item.product.price)}</b>
      <div class="quantity-control"><button type="button" data-quantity="${item.id}" data-change="-1" aria-label="Remove one ${item.product.name}">−</button><span>${item.quantity}</span><button type="button" data-quantity="${item.id}" data-change="1" aria-label="Add one ${item.product.name}">+</button><button type="button" class="remove-item" data-remove="${item.id}">Remove</button></div>
    </div>
    <b class="cart-line-total">${formatPrice(item.product.price*item.quantity)}</b>
  </article>`).join('');
  const enquiry=encodeURIComponent('Webapp quote request: '+items.map(item=>`${item.quantity} × ${item.product.name}`).join(', ')+`. Goods subtotal ${formatPrice(subtotal)}. Please confirm freight, duty and delivery.`);
  cartSummary.innerHTML=`<span class="section-kicker">ORDER SUMMARY</span><h2>Looking good.</h2><div class="summary-line"><span>Goods subtotal</span><b>${formatPrice(subtotal)}</b></div><p>Freight, customs and delivery are confirmed in your personalised quote before you place an order.</p><a class="button button-dark" href="index.html#/contact?msg=${enquiry}">Request a landed quote <span aria-hidden="true">→</span></a>`;
}
function updateCart(){
  const total=cart.reduce((sum,item)=>sum+item.quantity,0);
  document.querySelector('#headerCartCount').textContent=String(total);
  const count=document.querySelector('#navCartCount');
  count.textContent=String(total);
  count.hidden=total===0;
  renderCart();
}
function showView(name){
  if(!views.some(view=>view.dataset.page===name))return;
  activeView=name;
  views.forEach(view=>{
    const active=view.dataset.page===name;
    view.hidden=!active;
    view.classList.toggle('is-active',active);
  });
  document.querySelectorAll('[data-view]').forEach(button=>{
    const active=button.dataset.view===name;
    if(button.classList.contains('nav-item')||button.classList.contains('top-link')){
      button.classList.toggle('is-active',active);
      if(button.classList.contains('nav-item')){
        if(active)button.setAttribute('aria-current','page');
        else button.removeAttribute('aria-current');
      }
    }
  });
  if(name==='shop')renderShop();
  if(name==='cart')renderCart();
  window.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'});
}
document.addEventListener('click',event=>{
  const viewButton=event.target.closest('[data-view]');
  if(viewButton){showView(viewButton.dataset.view);return;}
  const addButton=event.target.closest('[data-add]');
  if(addButton){
    const item=cart.find(entry=>entry.id===addButton.dataset.add);
    if(item)item.quantity+=1;
    else cart.push({id:addButton.dataset.add,quantity:1});
    saveCart();
    addButton.innerHTML='Added <span aria-hidden="true">✓</span>';
    window.setTimeout(()=>{if(addButton.isConnected)addButton.innerHTML='Add to bag <span aria-hidden="true">+</span>';},1200);
    return;
  }
  const quantityButton=event.target.closest('[data-quantity]');
  if(quantityButton){
    const item=cart.find(entry=>entry.id===quantityButton.dataset.quantity);
    if(item)item.quantity+=Number(quantityButton.dataset.change);
    cart=cart.filter(entry=>entry.quantity>0);
    saveCart();
    return;
  }
  const removeButton=event.target.closest('[data-remove]');
  if(removeButton){
    cart=cart.filter(item=>item.id!==removeButton.dataset.remove);
    saveCart();
  }
});

document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{
  homeCategory=button.dataset.category;
  document.querySelectorAll('[data-category]').forEach(pill=>{
    const active=pill===button;
    pill.classList.toggle('is-active',active);
    pill.setAttribute('aria-pressed',String(active));
  });
  renderHomeProducts();
  productTrack.scrollTo({left:0,behavior:reducedMotion?'auto':'smooth'});
}));
document.querySelectorAll('[data-shop-category]').forEach(button=>button.addEventListener('click',()=>{
  shopCategory=button.dataset.shopCategory;
  document.querySelectorAll('[data-shop-category]').forEach(pill=>{
    const active=pill===button;
    pill.classList.toggle('is-active',active);
    pill.setAttribute('aria-pressed',String(active));
  });
  renderShop();
}));
document.querySelector('#shopSearch').addEventListener('input',event=>{
  shopQuery=event.target.value.trim();
  renderShop();
});
document.querySelector('#productsPrev').addEventListener('click',()=>productTrack.scrollBy({left:-productTrack.clientWidth*.8,behavior:reducedMotion?'auto':'smooth'}));
document.querySelector('#productsNext').addEventListener('click',()=>productTrack.scrollBy({left:productTrack.clientWidth*.8,behavior:reducedMotion?'auto':'smooth'}));
document.addEventListener('keydown',event=>{
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){
    event.preventDefault();
    showView('shop');
    document.querySelector('#shopSearch').focus();
  }
});

let activeOffer=0;
function showOffer(index){
  activeOffer=(index+promotions.length)%promotions.length;
  const offer=promotions[activeOffer];
  document.querySelector('#offerKicker').textContent=offer.kicker;
  document.querySelector('#offerTitle').innerHTML=offer.title;
  document.querySelector('#offerText').textContent=offer.text;
  document.querySelector('#offerImage').src=offer.image;
  document.querySelector('#offerImage').alt=offer.alt;
  const link=document.querySelector('#offerLink');
  link.href=offer.link;
  link.innerHTML=`${offer.action} <span aria-hidden="true">↗</span>`;
  document.querySelectorAll('.offer-dot').forEach((dot,index)=>{
    const active=index===activeOffer;
    dot.classList.toggle('is-active',active);
    dot.setAttribute('aria-pressed',String(active));
  });
}
document.querySelectorAll('.offer-dot').forEach(dot=>dot.addEventListener('click',()=>showOffer(Number(dot.dataset.offer))));
if(!reducedMotion)window.setInterval(()=>showOffer(activeOffer+1),6500);

renderHomeProducts();
renderShop();
updateCart();
showView(activeView);
