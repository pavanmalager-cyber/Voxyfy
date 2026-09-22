const $ = s => document.querySelector(s);
const messagesEl = $('#messages');
const input = $('#input');
const model = $('#model');
const modelLabel = $('#modelLabel');
const state = $('#state');
const substate = $('#substate');
let history = JSON.parse(localStorage.getItem('voxyfy_history') || '[]');
let chat = [];

const labels = {
  "gpt-6-astra":"Astra",
  "gpt-5.6-sol":"Sol",
  "gpt-5.6-terra":"Terra",
  "gpt-5.6-luna":"Luna"
};

model.value = window.DEFAULT_MODEL || "gpt-5.6-sol";
modelLabel.textContent = labels[model.value] || "Sol";

function saveHistory(text){
  history.unshift(text);
  history = history.slice(0,7);
  localStorage.setItem('voxyfy_history', JSON.stringify(history));
  renderHistory();
}
function renderHistory(){
  const box = $('#history');
  box.innerHTML = '';
  history.forEach(t=>{
    const b=document.createElement('button');
    b.className='recent';
    b.textContent=t;
    b.onclick=()=>{ input.value=t; input.focus(); };
    box.appendChild(b);
  });
}
function add(role,text,save=false){
  const row=document.createElement('div');
  row.className='message '+role;
  if(role==='assistant'){
    row.innerHTML='<div class="bot-dot"></div><div class="bubble"></div>';
  }else{
    row.innerHTML='<div class="bubble"></div>';
  }
  row.querySelector('.bubble').textContent=text;
  messagesEl.appendChild(row);
  messagesEl.scrollTop=messagesEl.scrollHeight;
  if(save) saveHistory(text);
}
function setThinking(on){
  state.textContent=on?'THINKING':'CALM';
  substate.textContent=on?'Shikamaru is thinking…':'Ready when you are.';
  document.body.classList.toggle('thinking',on);
}
async function send(text){
  text=text.trim();
  if(!text)return;
  add('user',text,true);
  chat.push({role:'user',content:text});
  input.value=''; input.style.height='auto';
  setThinking(true);
  try{
    const r=await fetch('/api/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({messages:chat,model:model.value})
    });
    const data=await r.json();
    if(!r.ok) throw new Error(data.error||'Request failed');
    add('assistant',data.reply);
    chat.push({role:'assistant',content:data.reply});
  }catch(err){
    add('assistant','Connection error. Check your server and API configuration, then try again.');
    console.error(err);
  }finally{ setThinking(false); }
}
$('#composer').addEventListener('submit',e=>{e.preventDefault();send(input.value)});
document.querySelectorAll('[data-prompt]').forEach(b=>b.onclick=()=>send(b.dataset.prompt));
$('#clear').onclick=()=>{
  chat=[]; messagesEl.innerHTML='';
  add('assistant','New board. Same brain. What are we solving?');
};
$('#newChat').onclick=()=>{
  chat=[]; messagesEl.innerHTML='';
  add('assistant','Fresh conversation. Give me the objective.');
  input.focus();
};
$('#theme').onclick=()=>document.body.classList.toggle('light');
$('#menu').onclick=()=>$('#sidebar').classList.toggle('open');
model.onchange=()=>{modelLabel.textContent=labels[model.value]||model.value};
input.addEventListener('input',()=>{
  input.style.height='auto';
  input.style.height=Math.min(input.scrollHeight,140)+'px';
});
document.addEventListener('keydown',e=>{
  if(e.key==='Enter' && !e.shiftKey && document.activeElement===input){
    e.preventDefault(); send(input.value);
  }
});
document.querySelectorAll('button').forEach(el=>{
  el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.07, y=(e.clientY-r.top-r.height/2)*.07;
    el.style.setProperty('--mx',x+'px'); el.style.setProperty('--my',y+'px');
  });
  el.addEventListener('pointerleave',()=>{el.style.setProperty('--mx','0px');el.style.setProperty('--my','0px')});
});
renderHistory();
add('assistant','System online. I’m Shikamaru, your strategic AI guide. Give me the problem and we’ll find the next move.');
