(function () {
  const root=(window.TL&&window.TL.$?window.TL.$('#sistema'):document.querySelector('#sistema')); if(!root)return;
  const steps=[...root.querySelectorAll('[data-step]')], track=root.querySelector('[data-cycle-steps]'), current=root.querySelector('[data-cycle-current]'), ring=root.querySelector('[data-cycle-ring]'), dot=root.querySelector('[data-cycle-dot]'), reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches; let active=0;
  const setStep=(index,scroll=false)=>{active=(index+steps.length)%steps.length;steps.forEach((step,i)=>{const on=i===active;step.classList.toggle('is-active',on);step.setAttribute('aria-current',on?'step':'false');});if(current)current.textContent=String(active+1).padStart(2,'0');if(ring)ring.style.strokeDashoffset=String(1043-(1043*(active+1)/8));if(dot)dot.style.transform=`rotate(${active*45}deg)`;if(scroll&&window.matchMedia('(max-width:680px)').matches)steps[active]?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'start'});};
  root.querySelector('[data-cycle-prev]')?.addEventListener('click',()=>setStep(active-1,true));root.querySelector('[data-cycle-next]')?.addEventListener('click',()=>setStep(active+1,true));
  root.addEventListener('keydown',(event)=>{if(event.key==='ArrowRight')setStep(active+1);if(event.key==='ArrowLeft')setStep(active-1);});
  root.tabIndex=0;
  const update=()=>{if(reduced||window.matchMedia('(max-width:680px)').matches)return;const rect=root.getBoundingClientRect(), span=Math.max(1,rect.height-window.innerHeight), ratio=Math.max(0,Math.min(1,-rect.top/span));setStep(Math.min(7,Math.floor(ratio*8)));};
  let usesProgress=false;if(!reduced&&window.TL?.progress){try{window.TL.progress(root,{mode:'pin',update});usesProgress=true;}catch(_error){/* scroll fallback below */}}
  if(!reduced&&!usesProgress)window.addEventListener('scroll',update,{passive:true});if(!reduced)update();
  let scrollTimer;track?.addEventListener('scroll',()=>{if(!window.matchMedia('(max-width:680px)').matches)return;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{const target=track.scrollLeft+track.clientWidth*.12;let nearest=0;steps.forEach((step,i)=>{if(Math.abs(step.offsetLeft-target)<Math.abs(steps[nearest].offsetLeft-target))nearest=i;});setStep(nearest);},80);},{passive:true});
}());
