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
    if(data.demo) substate.textContent='Demo mode • add an OpenRouter API key in Render for live AI';
    chat.push({role:'assistant',content:data.reply});
  }catch(err){
    add('assistant',err.message || 'The request failed. Check the server configuration.');
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

const navButtons=[...document.querySelectorAll('.sidebar .nav')];
const panelContent={
  'Shikamaru Chat':()=>{ messagesEl.scrollIntoView({behavior:'smooth',block:'center'}); input.focus(); },
  'Explore':()=>showPanel('Explore','Quick actions','Use the cards above to plan, explain or debug. You can also type anything into the chat and press send.'),
  'Tools':()=>showPanel('Tools','Built into VOXYFY','Web-ready architecture\nConversation memory in this session\nModel selector\nTheme switcher\nRecent conversation shortcuts'),
  'Library':()=>showPanel('Library','Your recent prompts',history.length?history.map((x,i)=>`${i+1}. ${x}`).join('\n'):'No saved prompts yet. Your recent prompts will appear here.'),
  'Settings':()=>showPanel('Settings','Workspace settings',`Model: ${labels[model.value]||model.value}\nTheme: ${document.body.classList.contains('light')?'Light':'Dark'}\nAPI: ${location.origin}/api/chat`)
};
function showPanel(title,subtitle,body){
  let p=document.getElementById('voxyPanel');
  if(!p){p=document.createElement('div');p.id='voxyPanel';p.className='voxy-panel';p.innerHTML='<div class="voxy-panel-card"><button class="voxy-panel-close">×</button><div class="eyebrow"></div><h2></h2><p class="panel-sub"></p><pre></pre></div>';document.body.appendChild(p);p.querySelector('.voxy-panel-close').onclick=()=>p.remove();p.addEventListener('click',e=>{if(e.target===p)p.remove();});}
  p.querySelector('.eyebrow').textContent=subtitle.toUpperCase();p.querySelector('h2').textContent=title;p.querySelector('pre').textContent=body;p.classList.add('show');
}
navButtons.forEach(btn=>btn.addEventListener('click',()=>{navButtons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const fn=panelContent[btn.textContent.trim()];if(fn)fn();}));
async function checkHealth(){try{const r=await fetch('/api/health');const d=await r.json();if(d.configured){substate.textContent=`Ready • ${labels[d.model]||d.model}`;}else{substate.textContent='Demo mode • OpenRouter key not configured';}}catch(e){substate.textContent='Server connection unavailable';}}
checkHealth();
renderHistory();
add('assistant','System online. I’m Shikamaru, your strategic AI guide. Give me the problem and we’ll find the next move.');
