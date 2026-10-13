import {readNotice,rememberNotice,forgetNotice} from './privacy-preferences.js';
const panel=document.getElementById('privacy-panel');
const launcher=document.getElementById('privacy-launcher');
if(panel&&launcher){
  const fr=document.documentElement.lang==='fr';
  const accept=panel.querySelector('[data-privacy-accept]');
  const dismiss=panel.querySelector('[data-privacy-dismiss]');
  const reset=panel.querySelector('[data-privacy-reset]');
  const status=panel.querySelector('[role="status"]');
  let saved=false;
  function storage(){try{return window.localStorage;}catch{return null;}}
  function show(focus=false){
    saved=!!readNotice(storage());
    panel.hidden=false;launcher.hidden=true;status.textContent='';reset.hidden=!saved;
    if(focus)accept.focus();
  }
  function hide(restoreFocus=false){panel.hidden=true;launcher.hidden=false;if(restoreFocus)launcher.focus();}
  launcher.addEventListener('click',()=>show(true));
  document.querySelectorAll('[data-privacy-open]').forEach(button=>button.addEventListener('click',()=>show(true)));
  accept.addEventListener('click',()=>{
    if(rememberNotice(storage()))hide(true);
    else status.textContent=fr?'Votre navigateur ne permet pas de mémoriser ce choix. Vous pouvez continuer sans l’enregistrer.':'Your browser did not allow this choice to be saved. You can continue without saving it.';
  });
  dismiss.addEventListener('click',()=>hide(true));
  reset.addEventListener('click',()=>{
    if(forgetNotice(storage())){saved=false;reset.hidden=true;status.textContent=fr?'Votre choix mémorisé a été supprimé.':'Your saved choice has been removed.';}
    else status.textContent=fr?'Votre navigateur ne permet pas de supprimer ce choix. Vous pouvez effacer le stockage de ce site dans ses réglages.':'Your browser did not allow the saved choice to be removed. You can clear this website’s storage in your browser settings.';
  });
  panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();hide(true);}});
  window.addEventListener('storage',()=>{saved=!!readNotice(storage());if(!panel.hidden)reset.hidden=!saved;});
  saved=!!readNotice(storage());
  if(saved)hide();else show();
}
