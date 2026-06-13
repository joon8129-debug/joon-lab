function normalizeConsent(input={}){
  return { privacy:Boolean(input.privacy || input.privacyConsent), matching:Boolean(input.matching), marketing:Boolean(input.marketing), thirdParty:Boolean(input.thirdParty), timestamp:input.timestamp || new Date().toISOString(), version:input.version || 'v1' };
}
function requirePrivacyConsent(input={}){
  const consent = normalizeConsent(input.consent || input);
  if(!consent.privacy) throw new Error('privacy_consent_required');
  return consent;
}
function ledgerEntry({ subjectId, action, consent={}, source='', actor='user' }={}){
  return { id:`consent_${Date.now()}_${Math.random().toString(36).slice(2)}`, subjectId, action, consent:normalizeConsent(consent), source, actor, createdAt:new Date().toISOString() };
}
function redactProfile(profile={}){
  const { contact, phone, email, profileToken, token, ...rest } = profile;
  return rest;
}
function exportSubjectData(subjectId, data={}){
  const pick = arr => (arr||[]).filter(x => x.profileId === subjectId || x.subjectId === subjectId || x.id === subjectId);
  return { subjectId, exportedAt:new Date().toISOString(), profile:(data.profiles||[]).find(p=>p.id===subjectId), matchRequests:pick(data.matchRequests), orders:pick(data.orders), proamApplications:pick(data.proamApplications), consentLedger:pick(data.consentLedger) };
}
module.exports = { normalizeConsent, requirePrivacyConsent, ledgerEntry, redactProfile, exportSubjectData };
