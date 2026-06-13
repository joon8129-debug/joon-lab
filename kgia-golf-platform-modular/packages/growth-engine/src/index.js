const crypto = require('crypto');
function hash(input){ return crypto.createHash('sha256').update(String(input)).digest('hex'); }
function assignVariant(experiment, visitorId){
  const variants = experiment?.variants || [];
  if(!variants.length) return null;
  const total = variants.reduce((sum,v)=>sum+Number(v.weight||1),0);
  const bucket = parseInt(hash(`${experiment.key || experiment.id}:${visitorId}`).slice(0,8),16) % total;
  let cursor=0;
  for(const v of variants){ cursor += Number(v.weight||1); if(bucket < cursor) return { ...v, experimentId:experiment.id, experimentKey:experiment.key }; }
  return variants[0];
}
function funnelReport(data={}){
  const profiles = data.profiles || [];
  const matchRequests = data.matchRequests || [];
  const matchRooms = data.matchRooms || [];
  const proamApplications = data.proamApplications || [];
  const orders = data.orders || [];
  return { tests:profiles.length, published:profiles.filter(p=>p.visibility==='public' || p.publishMatching).length, matchRequests:matchRequests.length, matchRooms:matchRooms.length, proamApplications:proamApplications.length, orders:orders.length, paidOrders:orders.filter(o=>o.status==='paid').length };
}
function cohortBy(items=[], keyFn){ return items.reduce((acc,item)=>{ const k=keyFn(item) || 'unknown'; acc[k]=(acc[k]||0)+1; return acc; },{}); }
function growthSnapshot(data={}){ return { createdAt:new Date().toISOString(), funnel:funnelReport(data), byResult:cohortBy(data.profiles||[], p=>p.resultName||p.resultCode), bySource:cohortBy(data.events||[], e=>e.source||e.campaign?.source) }; }
module.exports = { assignVariant, funnelReport, cohortBy, growthSnapshot };
