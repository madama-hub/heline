import https from 'node:https';
import fs from 'node:fs/promises';
const root = new URL('../dist/assets/', import.meta.url);
async function download(url, file){
  const body = await new Promise((resolve,reject)=>{
    https.get(url,{headers:{'User-Agent':'Mozilla/5.0'}},res=>{
      if(res.statusCode!==200){reject(new Error(`${res.statusCode}: ${url}`));res.resume();return;}
      const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>resolve(Buffer.concat(chunks)));res.on('error',reject);
    }).on('error',reject);
  });
  await fs.writeFile(new URL(file,root),body);
  console.log(`${file}: ${body.length} bytes`);
  return body;
}
const urls={
  'paris.jpg':'https://images.unsplash.com/photo-1583265266785-aab9e443ee68?auto=format&fit=crop&w=1800&q=85',
  'events.jpg':'https://images.unsplash.com/photo-1768508948508-507b3ff10cd3?auto=format&fit=crop&w=1800&q=85'
};
if(process.argv[2]) urls['nice.jpg']=process.argv[2];
await Promise.all(Object.entries(urls).map(([f,u])=>download(u,f)));
const css=(await download('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;600&display=swap','fonts.css')).toString();
let localCss=css;
const fontUrls=[...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)\s]+/g)||[])];
for(let i=0;i<fontUrls.length;i++){
  const extension=fontUrls[i].endsWith('.woff2')?'woff2':'ttf';
  const file=`font-${i}.${extension}`;
  await download(fontUrls[i],file);
  localCss=localCss.replaceAll(fontUrls[i],`./${file}`);
}
await fs.writeFile(new URL('fonts.css',root),localCss);
