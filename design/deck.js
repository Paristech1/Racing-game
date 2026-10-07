(function(){
  if(!window.AH_UI_DECK) return;

  const CONCEPTS=[
    {id:'issue',name:'Issue 01 (evolved)'},
    {id:'cockpit',name:'Night cockpit'},
    {id:'glass',name:'Glass dock'},
    {id:'neon',name:'Neon wire'},
    {id:'broadsheet',name:'Broadsheet tear-off'}
  ];
  const DECK_CARS=[0,1,2,4,7,9,13,16,21];
  const DECK_EVENTS=[0,1,3,6,14];

  function buildSlides(){
    const out=[];
    CONCEPTS.forEach(c=>{
      out.push({concept:c.id,conceptName:c.name,phase:'boot'});
      DECK_CARS.forEach((ci,i)=>{
        out.push({concept:c.id,conceptName:c.name,phase:'select',carIndex:ci,carN:i+1,carTotal:DECK_CARS.length});
      });
      DECK_EVENTS.forEach((ei,i)=>{
        out.push({concept:c.id,conceptName:c.name,phase:'events',carIndex:DECK_CARS[0],eventIndex:ei,evN:i+1,evTotal:DECK_EVENTS.length});
      });
    });
    return out;
  }

  const SLIDES=buildSlides();
  let idx=0, autoTimer=null, autoOn=false;

  const root=document.createElement('div');
  root.id='uiDeck';
  root.innerHTML='<div class="deck-bar"><i id="deckBar"></i></div><div class="deck-row"><div class="deck-title" id="deckTitle"></div><div class="deck-btns"><button type="button" id="deckPrev" aria-label="Previous slide">←</button><button type="button" id="deckPlay">Auto</button><button type="button" id="deckNext" aria-label="Next slide">→</button></div></div>';
  document.body.appendChild(root);
  const chips=document.createElement('div');
  chips.className='ui-deck-chip';
  chips.innerHTML='<span>STREET</span><span>GLOW</span><span>SND</span>';
  document.body.appendChild(chips);
  document.body.classList.add('ui-deck-active');
  document.title='AFTERHOURS — UI style deck';

  const $=s=>document.querySelector(s);
  const titleEl=$('#deckTitle'), bar=$('#deckBar');

  function waitApi(){
    return new Promise(res=>{
      if(window.AH_UI_DECK_API) return res(window.AH_UI_DECK_API);
      const t=setInterval(()=>{ if(window.AH_UI_DECK_API){ clearInterval(t); res(window.AH_UI_DECK_API); } },40);
    });
  }

  function label(slide, api){
    const phase=slide.phase==='boot'?'Boot':slide.phase==='select'?'Car select':'Event picker';
    let detail='';
    if(slide.phase==='select'&&api){
      const d=api.CARS[slide.carIndex];
      detail=`${d.name} · ${slide.carN}/${slide.carTotal}`;
    }
    if(slide.phase==='events'&&api){
      const e=api.EVENTS[slide.eventIndex];
      detail=`${e.name} · ${slide.evN}/${slide.evTotal}`;
    }
    return {phase,detail};
  }

  function applyConcept(id){ document.body.dataset.uiConcept=id; }

  async function goSlide(i, dir){
    idx=(i+SLIDES.length)%SLIDES.length;
    const slide=SLIDES[idx], api=await waitApi();
    applyConcept(slide.concept);
    if(slide.phase==='boot'){
      api.goBoot();
      api.skipBoot();
    } else if(slide.phase==='select'){
      api.setPage(slide.carIndex);
    } else {
      api.setPage(slide.carIndex);
      api.setEvent(slide.eventIndex);
    }
    const L=label(slide,api);
    titleEl.innerHTML=`${slide.conceptName}<small>${L.phase}${L.detail?' · '+L.detail:''} · slide ${idx+1}/${SLIDES.length}</small>`;
    bar.style.width=((idx+1)/SLIDES.length*100)+'%';
  }

  function step(d){ goSlide(idx+d, d); }
  function toggleAuto(){
    autoOn=!autoOn;
    $('#deckPlay').classList.toggle('on',autoOn);
    if(autoTimer) clearInterval(autoTimer);
    if(autoOn) autoTimer=setInterval(()=>step(1),4500);
  }

  $('#deckPrev').onclick=()=>step(-1);
  $('#deckNext').onclick=()=>step(1);
  $('#deckPlay').onclick=()=>toggleAuto();

  window.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){ e.preventDefault(); step(-1); }
    if(e.key==='ArrowRight'){ e.preventDefault(); step(1); }
    if(e.key===' '){ e.preventDefault(); toggleAuto(); }
  },{capture:true});

  waitApi().then(api=>{
    api.skipBoot();
    const snd=$('#snd');
    if(snd&&snd.textContent.includes('on')) snd.click();
    const mus=$('#mus');
    if(mus&&mus.textContent.includes('on')) mus.click();
    goSlide(0,0);
  });
})();
