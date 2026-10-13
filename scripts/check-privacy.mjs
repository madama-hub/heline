import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {footer,closing} from '../src/views.mjs';
import {NOTICE_KEY,parseNotice,readNotice,rememberNotice,forgetNotice} from '../src/privacy-preferences.js';
const now=Date.UTC(2026,9,13,12);
let raw=null,writes=0;
const storage={getItem:()=>raw,setItem:(key,value)=>{assert.equal(key,'heline-privacy-notice');writes++;raw=value;},removeItem:key=>{assert.equal(key,NOTICE_KEY);raw=null;}};
assert.equal(readNotice(storage,now),null);
assert.equal(writes,0,'Reading the notice must not write browser storage');
assert.equal(rememberNotice(storage,now),true);
const record=JSON.parse(raw);
assert.deepEqual(Object.keys(record).sort(),['acknowledged','expiresAt','version']);
assert.equal(record.expiresAt-now,180*86400000,'Remember for 180 days');
assert.ok(readNotice(storage,record.expiresAt-1));
assert.equal(readNotice(storage,record.expiresAt),null,'Expired choices must not hide the notice');
assert.equal(raw,null,'Discard expired records on the next visit');
assert.equal(parseNotice(JSON.stringify({...record,version:0}),now),null,'Old policy versions need a new choice');
assert.equal(parseNotice(JSON.stringify({...record,acknowledged:false}),now),null);
assert.equal(parseNotice(JSON.stringify({...record,expiresAt:now+1000*86400000}),now),null,'Reject implausible future expiry');
assert.equal(parseNotice('{invalid',now),null);
assert.equal(forgetNotice(storage),true);
assert.equal(raw,null,'Withdrawal removes stored preference');
const blocked={getItem(){throw new Error('blocked')},setItem(){throw new Error('blocked')},removeItem(){throw new Error('blocked')}};
assert.equal(readNotice(blocked,now),null);
assert.equal(rememberNotice(blocked,now),false);
assert.equal(forgetNotice(blocked),false);
assert.equal(readNotice(null,now),null);
assert.equal(rememberNotice(null,now),false);
async function pages(dir){const entries=await fs.readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(entry=>entry.isDirectory()?pages(path.join(dir,entry.name)):path.join(dir,entry.name)))).flat();}
for(const file of (await pages('dist')).filter(file=>file.endsWith('.html'))){
  const html=await fs.readFile(file,'utf8');
  assert.equal((html.match(/id="privacy-panel"/g)||[]).length,1,`One privacy panel in ${file}`);
  assert.ok(html.includes('type="module" src="/assets/privacy.js"'),`Privacy controls loaded in ${file}`);
}
for(const [lang,expected] of [['fr','fbaf4ec6161f3a3d5962dbc873ae0edb7900ff8be40e4e99b5f156c9ee3df0bc'],['en','c728597e4c186faacc3e0d067fc9cd367c187ec0f524013026da26f59bf219ca']])assert.equal(crypto.createHash('sha256').update((footer(lang)+closing(lang)).replace(/\b\d{4} Héline First/,'2026 Héline First')).digest('hex'),expected,'Footer and pre-footer remain unchanged');
for(const file of ['dist/reservation/index.html','dist/en/reservation/index.html']){
  const html=await fs.readFile(file,'utf8');
  assert.ok(html.includes('data-request-submit disabled'),'Native form submission disabled until its draft handler is ready');
  assert.ok(html.includes('class="form-privacy"'),'Privacy information available at the point of collection');
}
console.log('PASS: no automatic storage, 180-day expiry, version changes, withdrawal and blocked browser storage.');
