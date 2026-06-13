const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
function ensureDir(dir){ fs.mkdirSync(dir,{recursive:true}); }
function readJson(file, fallback={}){ try{ return JSON.parse(fs.readFileSync(file,'utf8')); }catch{ return fallback; } }
function writeJson(file, data){ ensureDir(path.dirname(file)); fs.writeFileSync(file, JSON.stringify(data,null,2)); return data; }
function createJsonStore(file, seed={}){ ensureDir(path.dirname(file)); if(!fs.existsSync(file)) writeJson(file, seed); return { file, read:()=>readJson(file, seed), write:(data)=>writeJson(file,data), update:(fn)=>{ const data=readJson(file, seed); const next=fn(data)||data; return writeJson(file,next); } }; }
function id(prefix='id'){ return `${prefix}_${crypto.randomUUID()}`; }
function sha(value){ return crypto.createHash('sha256').update(String(value)).digest('hex'); }
function token(bytes=32){ return crypto.randomBytes(bytes).toString('hex'); }
function json(res, status, payload){ res.writeHead(status,{ 'Content-Type':'application/json; charset=utf-8' }); res.end(JSON.stringify(payload)); }
function parseBody(req, max=1024*1024){ return new Promise((resolve,reject)=>{ let body=''; req.on('data',chunk=>{ body+=chunk; if(body.length>max) reject(new Error('body_too_large')); }); req.on('end',()=>{ try{ resolve(body ? JSON.parse(body) : {}); }catch(e){ reject(new Error('invalid_json')); } }); }); }
function createOtp({ contact, ttlMs=5*60*1000 }={}){ const code=String(Math.floor(100000+Math.random()*900000)); return { challengeId:id('otp'), contact, codeHash:sha(code), devCode:code, expiresAt:new Date(Date.now()+ttlMs).toISOString(), verified:false }; }
function verifyOtp(challenge, code){ return Boolean(challenge && new Date(challenge.expiresAt).getTime() >= Date.now() && challenge.codeHash === sha(code)); }
function queueNotification({ type, to, template, payload={} }={}){ return { id:id('noti'), type:type||'generic', to, template, payload, status:'queued', createdAt:new Date().toISOString() }; }
module.exports = { ensureDir, readJson, writeJson, createJsonStore, id, sha, token, json, parseBody, createOtp, verifyOtp, queueNotification };
