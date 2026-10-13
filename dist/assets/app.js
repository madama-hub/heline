const language=document.documentElement.lang;
const header=document.querySelector('.site-header');
const toggle=document.querySelector('.menu-toggle');
const groups=[...document.querySelectorAll('.nav-group')];
function setMenu(open){header.classList.toggle('menu-open',open);toggle.querySelector('.menu-text').textContent=open?(language==='fr'?'Fermer':'Close'):'Menu';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',language==='fr'?(open?'Fermer le menu':'Ouvrir le menu'):(open?'Close menu':'Open menu'));}
toggle?.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
function scrollHeader(){header.classList.toggle('solid',header.dataset.alwaysSolid==='true'||window.scrollY>30);}
window.addEventListener('scroll',scrollHeader,{passive:true});scrollHeader();
groups.forEach(group=>group.addEventListener('toggle',()=>{if(group.open)groups.filter(other=>other!==group).forEach(other=>{other.open=false;});}));
document.addEventListener('click',event=>{groups.forEach(group=>{if(!group.contains(event.target))group.open=false;});});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){const openGroup=groups.find(g=>g.open);if(openGroup){openGroup.open=false;openGroup.querySelector('summary').focus();}else if(header.classList.contains('menu-open')){setMenu(false);toggle.focus();}}});
document.querySelectorAll('.desktop-nav a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
const mobileQuery=window.matchMedia('(max-width:900px)');mobileQuery.addEventListener('change',()=>setMenu(false));
const tabs=[...document.querySelectorAll('[role="tab"]')];
function activateTab(tab,focus=false){tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;});if(focus)tab.focus();}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activateTab(tab));tab.addEventListener('keydown',event=>{let index;if(event.key==='ArrowRight')index=(i+1)%tabs.length;if(event.key==='ArrowLeft')index=(i-1+tabs.length)%tabs.length;if(event.key==='Home')index=0;if(event.key==='End')index=tabs.length-1;if(index!==undefined){event.preventDefault();activateTab(tabs[index],true);}});});
const video=document.querySelector('.hero-video');
const videoButton=document.querySelector('.video-control');
if(video&&videoButton){
  const motion=window.matchMedia('(prefers-reduced-motion:reduce)');
  let userPaused=false,started=false;
  function updateVideo(){const playing=!video.paused;const label=playing?videoButton.dataset.pauseLabel:videoButton.dataset.playLabel;videoButton.setAttribute('aria-label',label);videoButton.querySelector('span').textContent=label;}
  async function startVideo(){if(!started){video.src=video.dataset.src;started=true;}try{await video.play();}catch{}updateVideo();}
  videoButton.disabled=false;
  videoButton.addEventListener('click',()=>{if(video.paused){userPaused=false;startVideo();}else{userPaused=true;video.pause();}});
  video.addEventListener('play',updateVideo);video.addEventListener('pause',updateVideo);
  video.addEventListener('error',()=>{videoButton.hidden=true;video.hidden=true;});
  const observer=new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;if(!visible){video.pause();}else if(!userPaused&&!motion.matches&&!navigator.connection?.saveData){startVideo();}},{threshold:.15});
  function observe(){observer.observe(video);}
  if(document.readyState==='complete')observe();else window.addEventListener('load',observe,{once:true});
  motion.addEventListener('change',()=>{if(motion.matches)video.pause();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(!userPaused&&!motion.matches&&video.getBoundingClientRect().bottom>0)startVideo();});
}
const form=document.getElementById('request-form');
if(form){
  const fr=language==='fr';
  const params=new URLSearchParams(location.search);
  ['airport','service'].forEach(name=>{const value=params.get(name);const select=form.elements.namedItem(name);if(value&&[...select.options].some(o=>o.value===value))select.value=value;});
  const dateInput=form.elements.namedItem('date');const now=new Date();dateInput.min=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
  ['passengers','children'].forEach(name=>{const input=form.elements.namedItem(name);input.min=name==='passengers'?'1':'0';input.max='999';input.step='1';});
  const dialog=document.getElementById('request-dialog');
  const preview=document.getElementById('request-preview');
  const status=document.getElementById('dialog-status');
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  const labels={name:fr?'Nom':'Name',company:fr?'Compagnie / société':'Company',email:fr?'E-mail':'Email',phone:fr?'Téléphone':'Phone',service:fr?'Demande':'Request',airport:fr?'Aéroport / lieu':'Airport / location',other:fr?'Autre lieu':'Other location',date:fr?'Date':'Date',time:fr?'Heure locale':'Local time',flight:fr?'Vol / train':'Flight / train',passengers:fr?'Voyageurs':'Travellers',bags:fr?'Bagages':'Bags',transfer:fr?'Transfert':'Transfer',welcome:fr?'Panneau d’accueil':'Welcome sign',driver:fr?'Chauffeur':'Chauffeur',driverphone:fr?'Téléphone chauffeur':'Chauffeur phone',mobility:fr?'Assistance mobilité':'Mobility assistance',children:fr?'Enfants en bas âge':'Young children',message:fr?'Demandes particulières':'Particular requests'};
  form.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const lines=[fr?'Bonjour Héline First,':'Hello Héline First,','',fr?'Je souhaite préparer la prestation suivante :':'I would like to arrange the following service:',''];
    for(const [name,value] of new FormData(form)){if(!String(value).trim())continue;const input=form.elements.namedItem(name);const text=input instanceof HTMLSelectElement?input.selectedOptions[0].textContent:name==='mobility'?(fr?'Oui':'Yes'):String(value).trim();lines.push(`${labels[name]} : ${text}`);}
    lines.push('',fr?'Merci de me contacter pour préciser les prestations et confirmer les modalités.':'Please contact me to discuss the services and confirm the arrangements.');
    preview.value=lines.join('\n');
    const subject=fr?'Demande d’accueil — Héline First':'Welcome request — Héline First';
    document.getElementById('request-email').href=`mailto:contact@helinefirst.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(preview.value)}`;
    status.textContent='';dialog.showModal();
  });
  document.getElementById('copy-request').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(preview.value);status.textContent=fr?'Demande copiée. Vous pouvez la coller dans votre e-mail.':'Request copied. You can paste it into your email.';}catch{preview.focus();preview.select();status.textContent=fr?'Sélectionnez et copiez le texte de votre demande.':'Select and copy the request text.';}});
  // Enable submission only after the browser-only draft handler is registered.
  form.querySelector('[data-request-submit]').disabled=false;
}
