function scoreLead(profile={}){
  const gci = Number(profile.gci?.total || 0);
  const scores = profile.scores || {};
  const intent = Number(profile.intentScore || 0);
  return Math.round(Math.min(100, gci*.45 + (scores.network||0)*.15 + (scores.content||0)*.15 + (scores.vip||0)*.10 + intent*.15));
}
function nextActions({ profiles=[], sponsorInquiries=[], orders=[] }={}){
  const actions=[];
  for(const p of profiles){
    const score=scoreLead(p);
    if(score>=80) actions.push({ type:'profile_followup', priority:'high', profileId:p.id, title:`고의향 프로필 연락: ${p.nickname || p.resultName || p.id}`, score });
  }
  for(const s of sponsorInquiries){
    const budget=Number(s.budget || s.budgetAmount || 0);
    if(s.status === 'new' || budget >= 3000000) actions.push({ type:'sponsor_followup', priority:budget>=3000000?'high':'medium', inquiryId:s.id, title:`스폰서 문의 확인: ${s.company || s.brand || s.id}`, score:Math.min(100, Math.round(budget/50000)) });
  }
  for(const o of orders){
    if(o.status === 'pending_checkout') actions.push({ type:'checkout_followup', priority:'medium', orderId:o.id, title:`체크아웃 대기 주문 follow-up: ${o.id}`, score:60 });
  }
  return actions.sort((a,b)=>b.score-a.score);
}
function pipelineSummary(items=[], statusKey='status'){
  return items.reduce((acc,item)=>{ const k=item[statusKey] || 'unknown'; acc[k]=(acc[k]||0)+1; return acc; },{});
}
module.exports = { scoreLead, nextActions, pipelineSummary };
