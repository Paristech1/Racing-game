(function(){
  const STORAGE='ahUiDeckSlide';
  const CONCEPTS=(window.AH_CONCEPTS||[]).map(c=>({id:c.id,name:c.name}));
  const STYLE_ONLY=(location.search.match(/[?&]style=([^&]+)/)||[])[1];
  const DECK_CARS=[0,1,2,4,7,9,13,16,21];
  const DECK_EVENTS=[0,1,3,6,14];

  function buildSlides(){
    const list=STYLE_ONLY?CONCEPTS.filter(c=>c.id===STYLE_ONLY):CONCEPTS;
    const out=[];
    list.forEach(c=>{
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
  let idx=0, autoTimer=null, autoOn=false, busy=false;

  const root=document.createElement('div');
  root.id='uiDeck';
  root.innerHTML='<div class="deck-bar"><i id="deckBar"></i></div><div class="deck-row"><div class="deck-title" id="deckTitle"></div><div class="deck-btns"><button type="button" id="deckPrev" aria-label="Previous slide">←</button><button type="button" id="deckPlay">Auto</button><button type="button" id="deckNext" aria-label="Next slide">→</button></div></div><p class="deck-hint">Boot → car select → events · real 3D · ← / → · Space = auto</p>';
  document.body.appendChild(root);
  const chips=document.createElement('div');
  chips.className='ui-deck-chip';
  chips.innerHTML='<span>STREET</span><span>GLOW</span><span>SND</span>';
  document.body.appendChild(chips);
  document.body.classList.add('ui-deck-active');
  document.title='AFTERHOURS — UI prototypes';

  const $=s=>document.querySelector(s);
  const titleEl=$('#deckTitle'), bar=$('#deckBar');
  const wait=ms=>new Promise(r=>setTimeout(r,ms));

  function screen(){ return document.querySelector('.screen.on')?.id; }
  function carPage(){
    const pg=$('#sPg'); if(!pg) return 0;
    const lead=pg.childNodes[0]; const t=lead&&lead.textContent?lead.textContent:pg.textContent;
    const m=String(t).trim().match(/(\d+)/); return m?+m[1]-1:0;
  }
  function carTotal(){
    const em=$('#sPg em'); if(!em) return 24;
    const m=em.textContent.match(/(\d+)/); return m?+m[1]:24;
  }
  function carName(){
    const hl=$('#sHead span:last-child'); return hl?hl.textContent.trim():'';
  }
  function eventName(){
    const on=$('#eRoster .epick.on b'); if(on) return on.nextSibling?.textContent?.trim()||'';
    const hl=$('#eHead span:last-child'); return hl?hl.textContent.trim():'';
  }

  async function waitBootReady(){
    for(let i=0;i<240;i++){ if($('#tap')?.classList.contains('ready')) return; await wait(50); }
  }
  async function waitForUi(){
    for(let i=0;i<300;i++){ if($('#tap')||$('#sPg')) return; await wait(50); }
  }
  async function turnToCar(target){
    const n=carTotal(); let guard=0;
    while(carPage()!==target&&guard++<n+2){
      const cur=carPage(), diff=(target-cur+n)%n;
      const btn=diff<=n/2?$('#next'):$('#prev');
      if(!btn) break;
      btn.click();
      await wait(420);
    }
  }
  async function pickEvent(ei){
    const btn=document.querySelector(`#eRoster .epick[data-i="${ei}"]`);
    if(btn&&!btn.classList.contains('on')){ btn.click(); await wait(500); }
  }

  function updateChrome(slide){
    let detail='';
    if(slide.phase==='select') detail=`${carName()||'…'} · ${slide.carN}/${slide.carTotal}`;
    if(slide.phase==='events') detail=`${eventName()||'…'} · ${slide.evN}/${slide.evTotal}`;
    const phase=slide.phase==='boot'?'Boot':slide.phase==='select'?'Car select':'Event picker';
    titleEl.innerHTML=`${slide.conceptName}<small>${phase}${detail?' · '+detail:''} · ${idx+1}/${SLIDES.length}</small>`;
    bar.style.width=((idx+1)/SLIDES.length*100)+'%';
  }

  async function applySlide(targetIdx){
    if(busy) return;
    busy=true;
    idx=(targetIdx+SLIDES.length)%SLIDES.length;
    const slide=SLIDES[idx];
    document.body.dataset.uiConcept=slide.concept;
    updateChrome(slide);

    if(slide.phase==='boot'){
      if(screen()!=='boot'){
        sessionStorage.setItem(STORAGE,String(idx));
        location.href='prototype.html';
        return;
      }
      busy=false;
      return;
    }

    if(screen()==='boot'){
      await waitBootReady();
      $('#tap')?.click();
      await wait(850);
    }
    if(screen()==='events'&&slide.phase==='select'){
      $('#eBack')?.click();
      await wait(700);
    }

    if(slide.phase==='select'){
      await turnToCar(slide.carIndex);
      updateChrome(slide);
      busy=false;
      return;
    }

    if(slide.phase==='events'){
      if(screen()!=='events'){
        await turnToCar(slide.carIndex);
        $('#race')?.click();
        await wait(1200);
      }
      await pickEvent(slide.eventIndex);
      updateChrome(slide);
    }
    busy=false;
  }

  function step(d){
    if(busy) return;
    const next=(idx+d+SLIDES.length)%SLIDES.length;
    if(SLIDES[next].phase==='boot'){
      sessionStorage.setItem(STORAGE,String(next));
      location.href='prototype.html';
      return;
    }
    applySlide(next);
  }

  function toggleAuto(){
    autoOn=!autoOn;
    $('#deckPlay').classList.toggle('on',autoOn);
    if(autoTimer) clearInterval(autoTimer);
    if(autoOn) autoTimer=setInterval(()=>{ if(!busy) step(1); },5000);
  }

  $('#deckPrev').onclick=()=>step(-1);
  $('#deckNext').onclick=()=>step(1);
  $('#deckPlay').onclick=()=>toggleAuto();

  window.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){ e.preventDefault(); step(-1); }
    if(e.key==='ArrowRight'){ e.preventDefault(); step(1); }
    if(e.key===' '){ e.preventDefault(); toggleAuto(); }
  },{capture:true});

  waitForUi().then(async()=>{
    const snd=$('#snd'); if(snd?.textContent.includes('on')) snd.click();
    const mus=$('#mus'); if(mus?.textContent.includes('on')) mus.click();
    const start=+(sessionStorage.getItem(STORAGE)||'0');
    sessionStorage.removeItem(STORAGE);
    await applySlide(start);
  });
})();
