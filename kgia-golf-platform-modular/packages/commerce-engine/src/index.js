const crypto = require('crypto');
const defaultOffers = [
  { id:'offer_match_vip', type:'matching', title:'VIP 라운딩 파트너 컨시어지', price:99000, currency:'KRW', status:'active' },
  { id:'offer_proam_creator', type:'proam', title:'GCAN 크리에이터 골프데이 사전 신청권', price:180000, currency:'KRW', status:'active' },
  { id:'offer_membership_s', type:'membership', title:'KGIA GCI S 멤버십 대기등록', price:0, currency:'KRW', status:'active' },
  { id:'offer_sponsor_bronze', type:'sponsor', title:'GCAN 브론즈 스폰서 패키지', price:3000000, currency:'KRW', status:'active' }
];
function id(prefix){ return `${prefix}_${crypto.randomUUID()}`; }
function findOffer(offerId, offers=defaultOffers){ return offers.find(o => o.id === offerId && o.status !== 'inactive'); }
function createOrder({ offerId, profileId, quantity=1, couponCode='', offers=defaultOffers }={}){
  const offer = findOffer(offerId, offers); if(!offer) throw new Error('offer_not_found');
  const amount = Math.max(0, Number(offer.price || 0) * Math.max(1, Number(quantity || 1)));
  return { id:id('order'), offerId, profileId, quantity, amount, currency:offer.currency || 'KRW', status:amount>0?'pending_checkout':'paid', couponCode, createdAt:new Date().toISOString() };
}
function createCheckoutIntent(order, options={}){
  return { orderId:order.id, amount:order.amount, currency:order.currency, provider:options.provider || 'mock', successUrl:options.successUrl || '', failUrl:options.failUrl || '', payload:{ orderName:options.orderName || order.offerId, customerKey:order.profileId || order.id } };
}
function markCheckoutComplete(order, receipt={}){
  return { ...order, status:'paid', paidAt:new Date().toISOString(), receiptId:receipt.receiptId || id('receipt') };
}
module.exports = { defaultOffers, findOffer, createOrder, createCheckoutIntent, markCheckoutComplete };
