#!/usr/bin/env node
const platform = require('../packages/golf-platform/src');
function assert(condition, message){ if(!condition) throw new Error(message); }
const answers = ['D','B','C','D','D','D','B','D','D','D','D','D','D','D','D'];
const scores = platform.partnerTest.scoreAnswers(answers);
const result = platform.partnerTest.pickResultType(scores);
assert(result.code === 'G07', `expected SNS 스타형, got ${result.code}`);
const gci = platform.gci.calculateGci({ scores, result, participation:80, referrals:2 });
assert(Number.isFinite(gci.total) && gci.total >= 0, `unexpected gci ${JSON.stringify(gci)}`);
const a = { id:'a', scores, gci, resultName:result.name, visibility:'public', region:'서울', preferredDay:'주말' };
const b = { id:'b', scores:{...scores, content:90, social:85, manners:80}, gci:{total:86,rank:'S'}, visibility:'public', region:'서울', preferredDay:'주말' };
const c = { id:'c', scores:{competition:90,social:10,manners:40,content:5,network:20,growth:75,healing:20,vip:20,fun:10}, gci:{total:60,rank:'B'}, visibility:'public' };
const recs = platform.matching.recommendCandidates(a, [b,c], { limit:2 });
assert(recs[0].candidate.id === 'b', 'matching order failed');
const groups = platform.proam.formGroups([a,b,c,{id:'d',scores:scores,gci:{total:75},visibility:'public'}], { groupSize:2 });
assert(groups.length === 2, 'grouping failed');
const order = platform.commerce.createOrder({ offerId:'offer_match_vip', profileId:'a' });
assert(order.amount === 99000, 'order amount failed');
const intent = platform.commerce.createCheckoutIntent(order);
assert(intent.orderId === order.id, 'checkout intent failed');
const variant = platform.growth.assignVariant({ id:'exp', key:'landing', variants:[{id:'a',weight:50},{id:'b',weight:50}] }, 'visitor1');
assert(variant.id, 'experiment assignment failed');
const redacted = platform.privacy.redactProfile({ id:'a', contact:'010', profileToken:'secret', nickname:'n' });
assert(!redacted.contact && !redacted.profileToken, 'redaction failed');
console.log('module smoke ok', { result:result.name, rank:gci.rank, topMatch:recs[0].score });
