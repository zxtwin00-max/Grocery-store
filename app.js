
const KEY="grocery_app_v1",KM="grocery_meals_v1";
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const money=n=>"$"+Number(n).toFixed(2);
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}}
function save(s){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
function loadM(){try{const m=JSON.parse(localStorage.getItem(KM));return{people:m&&m.people||2,sel:m&&m.sel||{}}}catch(e){return{people:2,sel:{}}}}
function saveM(m){try{localStorage.setItem(KM,JSON.stringify(m))}catch(e){}}
function get(s,i){const o=s[i]||{};const g=window.GROCERY[i];return{buy:!!o.buy,qty:o.qty??1,price:o.price??g.p,mq:o.mq||0}}
const STAPLE=["jar","bottle","box"];
function roundNeed(u,x){if(x<=0)return 0;if(STAPLE.includes(u))return 1;if(u==="kg"||u==="L")return Math.ceil(x*10-1e-9)/10;return Math.ceil(x-1e-9)}
// Re-computes grocery quantities from the chosen meals (scaled to number of people, base = 2)
function recalc(){const S=load(),M=loadM(),raw={};
for(const mi in M.sel){if(M.sel[mi])(NEEDS[mi]||[]).forEach(([gi,q])=>{raw[gi]=(raw[gi]||0)+q*M.people/2})}
GROCERY.forEach((g,i)=>{const nw=roundNeed(g.u,raw[i]||0),o=S[i]||(S[i]={}),old=o.mq||0;
if(nw>0){if(!o.buy){o.buy=true;o.qty=nw}else{o.qty=Math.round(((o.qty??1)-old+nw)*100)/100}}
else if(old>0&&o.buy){o.qty=Math.round(((o.qty??1)-old)*100)/100;if(o.qty<=0.0001){o.buy=false;delete o.qty}}
o.mq=nw;if(!o.buy&&!o.mq&&o.qty===undefined&&o.price===undefined)delete S[i]});
save(S)}
function totals(){const s=load();let t=0,n=0;const cat={};window.GROCERY.forEach((g,i)=>{const o=get(s,i);if(o.buy){const l=o.qty*o.price;t+=l;n++;cat[g.c]=(cat[g.c]||0)+l}});return{t,n,cat}}
(function nav(){const p=[["index.html","Home"],["grocery.html","Grocery List"],["meals.html","Meals"],["summary.html","Summary & Total"]];
const cur=location.pathname.split("/").pop()||"index.html";
document.body.insertAdjacentHTML("afterbegin","<nav>"+p.map(([h,t])=>`<a href="${h}" class="${cur===h?"on":""}">${t}</a>`).join("")+'<button class="install-btn" style="margin-left:auto;background:#fff;color:#2e7d32">📲 Install app</button></nav>')})();

let DP=null;
const standalone=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});
addEventListener("beforeinstallprompt",e=>{e.preventDefault();DP=e});
addEventListener("appinstalled",()=>{DP=null;document.querySelectorAll(".install-btn").forEach(b=>b.style.display="none")});
if(standalone())document.querySelectorAll(".install-btn").forEach(b=>b.style.display="none");
function howTo(){const d=document.createElement("div");d.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:20;display:flex;align-items:center;justify-content:center;padding:16px";
const file=location.protocol==="file:";
d.innerHTML=`<div style="background:#fff;border-radius:14px;padding:20px;max-width:460px;max-height:85vh;overflow:auto"><h3 style="margin-top:0">📲 Install as a mobile app</h3>`+(file?`<p><b>First open the website link</b> (https://…github.io/…) instead of the file on your PC, then tap Install.</p>`:"")+
`<p><b>Android (Chrome):</b> tap the ⋮ menu, then <i>Install app</i> or <i>Add to Home screen</i>.</p><p><b>iPhone / iPad (Safari):</b> tap the Share button, then <i>Add to Home Screen</i>, then <i>Add</i>.</p><p><b>Windows / Mac (Chrome or Edge):</b> click the install icon at the right of the address bar, or menu, then <i>Install</i>.</p><button style="width:100%">Close</button></div>`;
d.onclick=e=>{if(e.target===d||e.target.tagName==="BUTTON")d.remove()};document.body.appendChild(d)}
document.addEventListener("click",async e=>{if(!e.target.classList.contains("install-btn"))return;
if(DP){DP.prompt();try{await DP.userChoice}catch(x){}DP=null}else howTo()});
