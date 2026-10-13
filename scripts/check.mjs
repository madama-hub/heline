import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {routes} from '../src/content.mjs';
const root=path.resolve('dist');
let pages=0,links=0;
const failures=[];
async function walk(dir){const entries=await fs.readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(dir,e.name)):path.join(dir,e.name)))).flat();}
const files=await walk(root);
for(const file of files.filter(f=>f.endsWith('.html')&&!f.endsWith('video-preview.html'))){
  const html=await fs.readFile(file,'utf8');pages++;
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(ids.length!==new Set(ids).size)failures.push(`Duplicate IDs: ${file}`);
  if((html.match(/<h1(?:\s|>)/g)||[]).length!==1)failures.push(`Expected one primary heading: ${file}`);
  if(!html.includes('<title>')||!html.includes('name="viewport"'))failures.push(`Missing page metadata: ${file}`);
  if(!file.endsWith('404.html')){
    if(!html.includes('name="description"')||!html.includes('rel="canonical"')||!html.includes('hreflang="fr"')||!html.includes('hreflang="en"'))failures.push(`Missing search metadata: ${file}`);
    for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))try{JSON.parse(match[1]);}catch{failures.push(`Invalid structured data: ${file}`);}
  }
  for(const match of html.matchAll(/\b(?:href|src|poster|data-src)="([^"]+)"/g)){
    const target=match[1];if(!target.startsWith('/')&&!target.startsWith('#'))continue;
    links++;const [url,fragment]=target.split('#');
    if(target.startsWith('#')){if(!ids.includes(fragment))failures.push(`Missing fragment ${target}: ${file}`);continue;}
    const clean=url.split('?')[0];let resolved=path.join(root,decodeURIComponent(clean));
    if(clean.endsWith('/'))resolved=path.join(resolved,'index.html');
    try{await fs.access(resolved);}catch{failures.push(`Missing ${target}: ${file}`);}
  }
}
for(const [key,pair] of Object.entries(routes))for(const url of pair)try{await fs.access(path.join(root,url,'index.html'));}catch{failures.push(`Missing ${key}: ${url}`);}
const originalPath=await fs.access('media/video-original.mp4').then(()=>'media/video-original.mp4',()=>'../video 1.mp4');
const original=await fs.readFile(originalPath),deployed=await fs.readFile('dist/assets/hero.mp4');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const provenance=JSON.parse(await fs.readFile('dist/assets/video-provenance.json','utf8'));
if(hash(original)!==provenance.source_sha256||hash(deployed)!==provenance.web_sha256)failures.push('Video provenance does not match the supplied source or encoded web copy.');
if(deployed.length>=original.length)failures.push('The web copy did not reduce video size.');
if(deployed.length>25*1024*1024)failures.push('Video exceeds the static hosting single-file size limit.');
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log(`PASS: ${pages} HTML pages, ${links} local references, metadata, locale routes, supplied-video provenance.`);
