
const KEY="grocery_app_v1";
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const money=n=>"$"+Number(n).toFixed(2);
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}}
function save(s){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
function get(s,i){const o=s[i]||{};const g=window.GROCERY[i];return{buy:!!o.buy,qty:o.qty??1,price:o.price??g.p}}
function totals(){const s=load();let t=0,n=0;const cat={};window.GROCERY.forEach((g,i)=>{const o=get(s,i);if(o.buy){const l=o.qty*o.price;t+=l;n++;cat[g.c]=(cat[g.c]||0)+l}});return{t,n,cat}}
(function nav(){const p=[["index.html","Home"],["grocery.html","Grocery List"],["meals.html","50 Meals"],["summary.html","Summary & Total"]];
const cur=location.pathname.split("/").pop()||"index.html";
document.body.insertAdjacentHTML("afterbegin","<nav>"+p.map(([h,t])=>`<a href="${h}" class="${cur===h?"on":""}">${t}</a>`).join("")+"</nav>")})();
