function clamp(n,min=0,max=100){ const v=Number(n); return Math.max(min, Math.min(max, Number.isFinite(v) ? v : min)); }
function rankFrom(total){ total=Number(total)||0; if(total>=92)return'M'; if(total>=85)return'S'; if(total>=75)return'A'; if(total>=62)return'B'; return'C'; }
function calculateGci({ scores={}, influence=50, participation=50, referrals=0 }={}){
  const manners = clamp(scores.manners || 0);
  const content = clamp(scores.content || 0);
  const network = clamp(scores.network || 0);
  const social = clamp(scores.social || 0);
  const total = Math.round(
    manners * .25 +
    clamp(participation) * .20 +
    clamp(influence || Math.max(network, social)) * .20 +
    content * .15 +
    clamp(referrals * 10, 0, 100) * .10 +
    network * .10
  );
  return { total, rank: rankFrom(total), components:{ manners, participation:clamp(participation), influence:clamp(influence || Math.max(network, social)), content, referrals:clamp(referrals*10,0,100), network } };
}
function adSegmentsFrom(scores={}, result={}){
  const out = new Set(); const name = String(result.name || result.resultName || '');
  if((scores.content||0) >= 75 || /SNS|콘텐츠|크리에이터|유튜버/.test(name)) out.add('content');
  if((scores.vip||0) >= 75 || /VIP|의전|럭셔리/.test(name)) out.add('luxury');
  if((scores.competition||0) >= 75 || /PGA|승부|고수|장비/.test(name)) out.add('equipment');
  if((scores.healing||0) >= 75 || /힐링|여행/.test(name)) out.add('resort');
  if((scores.network||0) >= 75 || /CEO|인맥|엠버서더|팬클럽/.test(name)) out.add('business');
  if((scores.manners||0) >= 80 || /캐디|매너/.test(name)) out.add('etiquette');
  if((scores.growth||0) >= 75 || /레슨|성장/.test(name)) out.add('lesson');
  if((scores.social||0) >= 80 || (scores.fun||0) >= 80 || /분위기|즐겜|모두의프로암/.test(name)) out.add('social');
  if(!out.size) out.add('general_golf');
  return [...out];
}
function advertiserFit(profile={}, campaign={}){
  const segments = new Set(profile.adSegments || adSegmentsFrom(profile.scores || {}, profile.result || profile));
  const target = campaign.segment || campaign.targetSegment;
  const minGci = Number(campaign.minGci || 0);
  const gci = Number(profile.gci?.total || 0);
  return { fit: (!target || segments.has(target)) && gci >= minGci, segments:[...segments], gci };
}
module.exports = { rankFrom, calculateGci, adSegmentsFrom, advertiserFit };
