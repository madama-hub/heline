import fs from 'node:fs/promises';
import path from 'node:path';
import {routes,ui,homeContent,services,contact} from '../src/content.mjs';
import {esc,href,header,footer,home,servicePage,contactPage,bookingPage,legalPage} from '../src/views.mjs';
const manifest=JSON.parse(await fs.readFile('.openai/hosting.json','utf8'));
manifest.static={directory:'dist'};
await fs.writeFile('.openai/hosting.json',JSON.stringify(manifest,null,2)+'\n');
const origin=process.env.SITE_ORIGIN||'https://heline-first.w1nk0.chatgpt.site';
await fs.mkdir('dist',{recursive:true});
await fs.copyFile('src/styles.css','dist/assets/styles.css');
await fs.copyFile('src/app.js','dist/assets/app.js');
const special={booking:{fr:['Réservation — Héline First','Préparez votre demande d’accueil aéroportuaire, de séjour ou d’évènement avec Héline First. Paris CDG et Nice Côte d’Azur.'],en:['Reservation — Héline First','Prepare your airport assistance, stay or event request with Héline First. Paris CDG and Nice Côte d’Azur.']},contact:{fr:['Contact — Héline First','Contactez Héline First pour votre accueil aéroportuaire à Paris et Nice, vos séjours et évènements sur mesure. Téléphone et e-mail, 24h/24, 7j/7.'],en:['Contact — Héline First','Contact Héline First for airport assistance in Paris and Nice, tailored stays and events. Phone and email, available 24/7.']},legal:{fr:['Mentions légales — Héline First','Informations de la société Héline First, conditions de prestation, demandes et coordonnées.'],en:['Legal information — Héline First','Héline First company information, service terms, requests and contact details.']}};
export function render(key,lang){
  const url=origin+href(key,lang);
  const title=key==='home'?homeContent[lang].title:services[key]?`${services[key][lang].title} | Héline First`:special[key][lang][0];
  const description=key==='home'?homeContent[lang].description:services[key]?services[key][lang].description:special[key][lang][1];
  const body=key==='home'?home(lang):services[key]?servicePage(key,lang):key==='booking'?bookingPage(lang):key==='contact'?contactPage(lang):legalPage(lang);
  const org={'@context':'https://schema.org','@type':'Organization',name:'Héline First',url:origin,email:contact.email,telephone:contact.tel,areaServed:['Paris Charles de Gaulle','Nice Côte d’Azur']};
  const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:ui[lang].home,item:origin+href('home',lang)},...(key==='home'?[]:[{'@type':'ListItem',position:2,name:services[key]?.[lang].title||special[key]?.[lang][0],item:url}])]};
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#142d34"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="fr" href="${origin+href(key,'fr')}"><link rel="alternate" hreflang="en" href="${origin+href(key,'en')}"><link rel="alternate" hreflang="x-default" href="${origin+href(key,'fr')}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin}/assets/hero-poster.jpg"><meta property="og:locale" content="${lang==='fr'?'fr_FR':'en_GB'}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/styles.css"><script type="application/ld+json">${JSON.stringify(org)}</script><script type="application/ld+json">${JSON.stringify(breadcrumb)}</script><script defer src="/assets/app.js"></script></head><body>${header(key,lang)}<main id="main">${body}</main>${footer(lang)}</body></html>`;
}
const sitemap=[];
for(const key of Object.keys(routes))for(const lang of ['fr','en']){
  const urlPath=href(key,lang);const file=path.join('dist',urlPath,'index.html');
  await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,render(key,lang));
  sitemap.push(`<url><loc>${origin+urlPath}</loc><xhtml:link rel="alternate" hreflang="fr" href="${origin+href(key,'fr')}"/><xhtml:link rel="alternate" hreflang="en" href="${origin+href(key,'en')}"/></url>`);
}
const aliases={'accueil-aéroportuaire.html':'airports','les-hôtesses-évènementielles.html':'hosts','les-services.html':'plus','le-réceptif-un-service-sur-mesure.html':'stays','organisation-évènementielle.html':'events','réservation.html':'booking','contact.html':'contact','mentions-légales.html':'legal'};
for(const [file,key] of Object.entries(aliases))await fs.writeFile(path.join('dist',file),render(key,'fr'));
await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${sitemap.join('')}</urlset>`);
await fs.writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await fs.writeFile('dist/assets/favicon.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#142d34"/><text x="32" y="44" text-anchor="middle" fill="#d5eee9" font-family="Georgia,serif" font-style="italic" font-size="46">h</text></svg>');
await fs.writeFile('dist/404.html',`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page introuvable — Héline First</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/assets/styles.css"></head><body>${header('contact','fr')}<main class="container not-found" id="main"><span class="kicker">404</span><h1>Retrouvons<br><em>votre chemin.</em></h1><p>Cette page n’est pas disponible.</p><a class="pill primary" href="/">Retour à l’accueil</a></main>${footer('fr')}<script src="/assets/app.js" defer></script></body></html>`);
console.log(`Built ${Object.keys(routes).length*2} pages, ${Object.keys(aliases).length} legacy URLs, sitemap and metadata.`);
