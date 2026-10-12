const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = Number(process.env.PORT || 3000);
const STATE_FILE = process.env.STATE_FILE || path.join(__dirname, 'state.json');
const stateDir = path.dirname(STATE_FILE);
const clients = new Set();
let state = { orders: [], chats: [], services: [] };
let writeQueue = Promise.resolve();
app.disable('x-powered-by');
app.use(express.json({ limit:'2mb' }));
app.use(express.static(__dirname, { index:'index.html', maxAge:'1h' }));
function normalizeState(value){ return {orders:Array.isArray(value?.orders)?value.orders:[], chats:Array.isArray(value?.chats)?value.chats:[], services:Array.isArray(value?.services)?value.services:[]}; }
function loadState(){ try{ state=normalizeState(JSON.parse(fs.readFileSync(STATE_FILE,'utf8'))); }catch{ state={orders:[],chats:[],services:[]}; } }
function queueSave(nextState){
  state=normalizeState(nextState); const serialized=JSON.stringify(state);
  writeQueue=writeQueue.then(async()=>{ await fs.promises.mkdir(stateDir,{recursive:true}); const tmp=STATE_FILE+'.tmp'; await fs.promises.writeFile(tmp,serialized,'utf8'); await fs.promises.rename(tmp,STATE_FILE); });
  return writeQueue;
}
function broadcast(){ const payload='event: state\ndata: '+JSON.stringify(state)+'\n\n'; for(const res of clients){ try{res.write(payload);}catch{clients.delete(res);} } }
loadState();
app.get('/api/health',(req,res)=>res.json({ok:true}));
app.get('/api/state',(req,res)=>{res.set('Cache-Control','no-store');res.json(state);});
app.post('/api/state',async(req,res)=>{try{state=normalizeState(req.body); broadcast(); await queueSave(state); res.json({ok:true});}catch(err){console.error('state save failed:',err);res.status(500).json({ok:false,error:'Не удалось сохранить данные'});}});
app.get('/api/events',(req,res)=>{
  res.status(200); res.set({'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'}); res.flushHeaders?.();
  res.write('retry: 2500\n\n'); res.write('event: state\ndata: '+JSON.stringify(state)+'\n\n'); clients.add(res);
  const heartbeat=setInterval(()=>{try{res.write(': heartbeat\n\n');}catch{clearInterval(heartbeat);clients.delete(res);}},20000);
  req.on('close',()=>{clearInterval(heartbeat);clients.delete(res);});
});
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.listen(PORT,'0.0.0.0',()=>console.log('Car Stables запущен на порту '+PORT));
