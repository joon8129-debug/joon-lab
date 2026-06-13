const AXES = ['competition','social','manners','content','network','growth','healing','vip','fun'];
const DEFAULT_WEIGHTS = { manners:.22, social:.15, competition:.13, content:.12, network:.11, healing:.10, fun:.08, growth:.05, vip:.04 };
function clamp(n,min=0,max=100){ const v=Number(n); return Math.max(min, Math.min(max, Number.isFinite(v) ? v : min)); }
function scoresOf(profile={}){ const src = profile.scores || profile.axisScores || profile.result?.scores || {}; const out={}; for(const axis of AXES) out[axis]=clamp(src[axis] ?? 0); return out; }
function sameText(a='', b=''){ return String(a || '').replace(/\s+/g,'').toLowerCase() === String(b || '').replace(/\s+/g,'').toLowerCase(); }
function compatibility(a={}, b={}, options={}){
  const weights = { ...DEFAULT_WEIGHTS, ...(options.weights || {}) };
  const as=scoresOf(a), bs=scoresOf(b);
  let total=0, weightSum=0;
  for(const axis of AXES){
    const w = Number(weights[axis] || 0);
    total += (100 - Math.abs(as[axis] - bs[axis])) * w;
    weightSum += w;
  }
  let score = weightSum ? total / weightSum : 0;
  if(a.region && b.region && sameText(a.region,b.region)) score += 4;
  if(a.preferredDay && b.preferredDay && sameText(a.preferredDay,b.preferredDay)) score += 3;
  if(a.skillLevel && b.skillLevel && sameText(a.skillLevel,b.skillLevel)) score += 2;
  const avoid = new Set([...(a.avoidTypes || []), ...(b.avoidTypes || [])].map(String));
  if(avoid.has(b.resultCode) || avoid.has(b.resultName) || avoid.has(a.resultCode) || avoid.has(a.resultName)) score -= 25;
  return Math.round(clamp(score));
}
function recommendCandidates(profile, candidates=[], options={}){
  const limit = options.limit || 10;
  const selfId = profile.id;
  return candidates
    .filter(c => c && c.id !== selfId && c.visibility !== 'private')
    .map(candidate => ({ candidate, score: compatibility(profile, candidate, options), reasons: explainMatch(profile, candidate) }))
    .filter(x => x.score >= (options.minScore || 0))
    .sort((a,b)=>b.score-a.score)
    .slice(0,limit);
}
function explainMatch(a={}, b={}){
  const as=scoresOf(a), bs=scoresOf(b);
  const reasons=[];
  for(const axis of AXES){ if(Math.abs(as[axis]-bs[axis]) <= 12 && Math.max(as[axis],bs[axis]) >= 65) reasons.push(`${axis} 성향 유사`); }
  if(a.region && b.region && sameText(a.region,b.region)) reasons.push('지역 선호 일치');
  if(a.preferredDay && b.preferredDay && sameText(a.preferredDay,b.preferredDay)) reasons.push('일정 선호 일치');
  return reasons.slice(0,4);
}
module.exports = { AXES, DEFAULT_WEIGHTS, scoresOf, compatibility, recommendCandidates, explainMatch };
