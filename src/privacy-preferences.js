export const NOTICE_KEY='heline-privacy-notice';
export const NOTICE_VERSION=1;
export const NOTICE_LIFETIME=180*24*60*60*1000;

export function parseNotice(raw,now=Date.now()){
  if(!raw)return null;
  try{
    const record=JSON.parse(raw);
    return record?.version===NOTICE_VERSION && record.acknowledged===true &&
      Number.isFinite(record.expiresAt) && record.expiresAt>now &&
      record.expiresAt<=now+NOTICE_LIFETIME ? record : null;
  }catch{return null;}
}
export function readNotice(storage,now=Date.now()){
  try{
    const raw=storage.getItem(NOTICE_KEY);
    const record=parseNotice(raw,now);
    if(raw&&!record)storage.removeItem(NOTICE_KEY);
    return record;
  }catch{return null;}
}
export function rememberNotice(storage,now=Date.now()){
  const record={version:NOTICE_VERSION,acknowledged:true,expiresAt:now+NOTICE_LIFETIME};
  try{storage.setItem(NOTICE_KEY,JSON.stringify(record));return true;}catch{return false;}
}
export function forgetNotice(storage){
  try{storage.removeItem(NOTICE_KEY);return true;}catch{return false;}
}
