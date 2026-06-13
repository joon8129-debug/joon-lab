const { compatibility } = require('../../matching-engine/src');
function average(nums){ return nums.length ? Math.round(nums.reduce((a,b)=>a+b,0)/nums.length) : 0; }
function pairScore(group){
  const scores=[];
  for(let i=0;i<group.length;i++) for(let j=i+1;j<group.length;j++) scores.push(compatibility(group[i],group[j]));
  return average(scores);
}
function gciAverage(group){ return average(group.map(p => Number(p.gci?.total || 0))); }
function formGroups(profiles=[], options={}){
  const groupSize = Math.max(2, Math.min(4, Number(options.groupSize || 4)));
  const pool = profiles.filter(Boolean).slice().sort((a,b)=>Number(b.gci?.total||0)-Number(a.gci?.total||0));
  const groups=[];
  while(pool.length){
    const seed = pool.shift(); const group=[seed];
    while(group.length < groupSize && pool.length){
      let bestIndex=0, bestScore=-1;
      for(let i=0;i<pool.length;i++){
        const candidate=pool[i];
        const score = average(group.map(member => compatibility(member,candidate))) - Math.abs(gciAverage(group)-Number(candidate.gci?.total||0))*0.05;
        if(score > bestScore){ bestScore=score; bestIndex=i; }
      }
      group.push(pool.splice(bestIndex,1)[0]);
    }
    groups.push({ id:`group_${groups.length+1}`, members:group, size:group.length, compatibilityScore:pairScore(group), gciAverage:gciAverage(group) });
  }
  return groups;
}
module.exports = { formGroups, pairScore, gciAverage };
