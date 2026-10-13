import https from 'node:https';
import fs from 'node:fs/promises';
for(const family of ['cormorantgaramond','dmsans']){
  const body=await new Promise((resolve,reject)=>https.get(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`,res=>{if(res.statusCode!==200){reject(Error(`License HTTP ${res.statusCode}`));res.resume();return;}const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>resolve(Buffer.concat(chunks)));}).on('error',reject));
  await fs.writeFile(`dist/assets/${family}-OFL.txt`,body);console.log(`Saved ${family} license.`);
}
