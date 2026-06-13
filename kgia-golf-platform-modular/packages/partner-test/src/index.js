const AXES = ['competition','social','manners','content','network','growth','healing','vip','fun'];
const choicePresets = {
  A:{competition:14,growth:4}, B:{social:12,fun:8}, C:{manners:14,healing:4}, D:{content:16,social:3}, E:{network:15,vip:5}
};
const questionTexts = [
  '티샷 전 가장 중요한 것은?', '동반자가 OB를 냈다.', '캐디와의 관계는?', '가장 싫은 사람은?', '버디를 하면?',
  '점심시간은?', '동반자가 늦었다.', '라운딩 목적은?', '선호하는 팀 분위기', '18홀 끝난 후',
  '프로와 동반 라운딩', '가장 많이 쓰는 말', '동반자가 실수하면', '골프 SNS 사용', '당신에게 골프란?'
];
const choiceLabels = [
  ['스코어','분위기','매너','콘텐츠','인맥'], ['집중하자','웃으며 위로','괜찮다고 배려','영상각 본다','조언해준다'],
  ['최소 대화','친하게','예의있게','콘텐츠 협조','정보 교류'], ['느린 플레이어','분위기 망치는 사람','무례한 사람','촬영 방해하는 사람','약속 안 지키는 사람'],
  ['다음 홀 집중','신난다','감사 인사','사진 찍는다','네트워크 기회'], ['전략 회의','수다','편안한 식사','촬영','비즈니스'],
  ['감점','이해','이유 확인','콘텐츠로 활용','신뢰 하락'], ['실력 향상','즐거움','관계','콘텐츠','사업'],
  ['경쟁','웃음','배려','화제성','네트워킹'], ['스코어 확인','식사','감사','업로드','미팅'],
  ['배우고 싶다','즐기고 싶다','예의 지킨다','촬영하고 싶다','인맥 만들고 싶다'], ['몇 타지?','재밌다','감사합니다','찍어주세요','소개해주세요'],
  ['분석','웃음','배려','콘텐츠화','연결'], ['거의 안함','가끔','기록용','적극적','비즈니스용'], ['스포츠','취미','관계','콘텐츠','비즈니스']
];
const defaultQuestions = questionTexts.map((text, idx) => ({
  id:`q${idx+1}`, text,
  choices:['A','B','C','D','E'].map((key, i) => ({ key, label:choiceLabels[idx][i], scores:choicePresets[key] }))
}));
const resultTypes = [
  { code:'G01', name:'골프 CEO형', axis:'network', tagline:'전반 9홀 동안 계약 2건' },
  { code:'G02', name:'캐디 최애형', axis:'manners', tagline:'오늘도 캐디 만족도 1등' },
  { code:'G03', name:'조용한 고수형', axis:'competition', secondary:'manners', tagline:'말은 없는데 70대' },
  { code:'G04', name:'멀리건 무한형', axis:'fun', secondary:'social', tagline:'체감 스코어 79타' },
  { code:'G05', name:'분위기 폭격기형', axis:'social', secondary:'fun', tagline:'스코어는 모르겠고 재밌었다' },
  { code:'G06', name:'PGA 빙의형', axis:'competition', secondary:'growth', tagline:'프로도 이렇게 안 친다' },
  { code:'G07', name:'SNS 스타형', axis:'content', secondary:'social', tagline:'좋아요가 버디' },
  { code:'G08', name:'레슨 중독형', axis:'growth', secondary:'competition', tagline:'오늘도 스윙 바뀜' },
  { code:'G09', name:'장비 연구원형', axis:'competition', secondary:'content', tagline:'드라이버는 투어급' },
  { code:'G10', name:'승부사형', axis:'competition', secondary:'network', tagline:'파보다 승리가 중요' },
  { code:'G11', name:'힐링 여행형', axis:'healing', tagline:'골프장에 여행 왔다' },
  { code:'G12', name:'프로암 스타형', axis:'social', secondary:'manners', tagline:'어디 가도 같이 치자고 함' },
  { code:'G13', name:'팬클럽 리더형', axis:'network', secondary:'social', tagline:'골프 인싸' },
  { code:'G14', name:'VIP 의전형', axis:'vip', secondary:'manners', tagline:'골프도 경험' },
  { code:'G15', name:'모두의프로암형', axis:'fun', secondary:'manners', tagline:'즐거운 골프의 표준' },
  { code:'G16', name:'KGIA 엠버서더형', axis:'network', secondary:'content', tagline:'골프 생태계 핵심' }
];
function clamp(n,min=0,max=100){ const v=Number(n); return Math.max(min, Math.min(max, Number.isFinite(v) ? v : min)); }
function emptyScores(){ return Object.fromEntries(AXES.map(axis => [axis, 0])); }
function normalizeScores(scores={}){ const out=emptyScores(); for(const axis of AXES) out[axis]=Math.round(clamp(scores[axis] || 0)); return out; }
function scoreAnswers(answers=[], questions=defaultQuestions){
  const raw=emptyScores();
  answers.forEach((answer, idx) => {
    const q=questions[idx]; if(!q) return;
    const choice=q.choices.find(c => c.key===answer || c.label===answer); if(!choice) return;
    for(const [axis,value] of Object.entries(choice.scores || {})) raw[axis]+=Number(value||0);
  });
  const max = questions.length * 16;
  const out=emptyScores(); for(const axis of AXES) out[axis]=Math.round(clamp((raw[axis]/max)*100));
  return out;
}
function topAxes(scores={}, count=3){ return Object.entries(normalizeScores(scores)).sort((a,b)=>b[1]-a[1]).slice(0,count).map(([axis,value])=>({axis,value})); }
function pickResultType(scores={}, types=resultTypes){
  const s=normalizeScores(scores); let best=types[0], bestScore=-1;
  for(const type of types){ const score=(s[type.axis]||0)+(type.secondary?(s[type.secondary]||0)*0.45:0); if(score>bestScore){ best=type; bestScore=score; } }
  return { ...best, confidence:Math.round(clamp(bestScore)) };
}
function shareText(result, metrics={}){ const invite=metrics.returnInviteRate ?? metrics.returnInvite ?? ''; return `나는 ${result.name}! ${result.tagline}${invite ? ` · 다시 초대받을 확률 ${invite}%` : ''}`; }
module.exports = { AXES, defaultQuestions, resultTypes, clamp, emptyScores, normalizeScores, scoreAnswers, topAxes, pickResultType, shareText };
