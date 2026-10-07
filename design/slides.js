(function(){
  const CONCEPTS=window.AH_CONCEPTS||[];
  const params=new URLSearchParams(location.search);
  const gridMode=params.has('grid');

  if(gridMode){
    document.body.className='grid-body';
    document.title='AFTERHOURS — all UI mixes (grid)';
    const root=document.getElementById('slidesRoot');
    root.className='grid-page';
    root.innerHTML=`
      <header class="grid-head">
        <div>
          <h1>${CONCEPTS.length} UI mixes</h1>
          <p>Car-select mocks — same specimen on every card so you compare chrome only. Click a card to open the slideshow at that mix.</p>
        </div>
        <div class="nav"><a href="slides.html">Slideshow</a> · <a href="concepts.html">Picker</a> · <a href="index.html">Hub</a></div>
      </header>
      <div class="grid" id="grid"></div>`;
    const grid=document.getElementById('grid');
    CONCEPTS.forEach((c,i)=>{
      const card=document.createElement('article');
      card.className='grid-card';
      card.innerHTML=`<div class="phone" data-concept="${c.id}">${window.AH_PHONE_MOCK_INNER}</div><h3>${c.name}</h3><div class="tag">${c.tag}</div>`;
      card.onclick=()=>{location.href=`slides.html#${i}`;};
      grid.appendChild(card);
      window.applyConceptChrome(c.id,card.querySelector('.phone'));
    });
    return;
  }

  document.body.className='slides-body';
  document.title='AFTERHOURS — UI mix slideshow';
  let idx=0,autoTimer=null,autoOn=false;
  const total=CONCEPTS.length+1; /* title + each concept */

  const shell=document.getElementById('slidesRoot');
  shell.className='slides-shell';
  shell.innerHTML=`
    <header class="slides-top">
      <h1>UI mix deck</h1>
      <span class="count" id="slideCount"></span>
      <div class="links"><a href="slides.html?grid=1">All on one page</a><a href="concepts.html">Picker</a><a href="index.html">Hub</a></div>
    </header>
    <div class="slides-stage" id="stage"></div>
    <footer class="slides-bar">
      <div class="slides-progress"><i id="prog"></i></div>
      <div class="slides-controls">
        <span class="title" id="barTitle">—</span>
        <div class="btns">
          <button type="button" id="prev">←</button>
          <button type="button" id="play">Auto</button>
          <button type="button" id="next">→</button>
        </div>
      </div>
    </footer>`;

  const stage=document.getElementById('stage');

  const titleSlide=document.createElement('section');
  titleSlide.className='slide on';
  titleSlide.dataset.idx='0';
  titleSlide.innerHTML=`<div class="slide-title-card">
    <h2>AFTERHOURS UI</h2>
    <p>${CONCEPTS.length} car-select mixes · ← / → to step · Space for auto · <a href="slides.html?grid=1">grid view</a></p>
  </div>`;
  stage.appendChild(titleSlide);

  CONCEPTS.forEach((c,i)=>{
    const slide=document.createElement('section');
    slide.className='slide';
    slide.dataset.idx=String(i+1);
    slide.dataset.concept=c.id;
    slide.innerHTML=`
      <div class="slide-copy">
        <span class="tag">${c.tag}</span>
        <h2>${c.name}</h2>
        <p class="pitch">${c.pitch}</p>
        <div class="notes">${c.notes}</div>
      </div>
      <div class="slide-phone">
        <div class="phone" data-concept="${c.id}">${window.AH_PHONE_MOCK_INNER}</div>
      </div>`;
    stage.appendChild(slide);
    window.applyConceptChrome(c.id,slide.querySelector('.phone'));
  });

  function parseHash(){
    const h=location.hash.replace(/^#/,'');
    if(!h) return;
    const n=+h;
    if(!Number.isNaN(n)&&n>=0&&n<total) idx=n;
    else{
      const fi=CONCEPTS.findIndex(c=>c.id===h);
      if(fi>=0) idx=fi+1;
    }
  }

  function render(){
    stage.querySelectorAll('.slide').forEach(s=>{
      s.classList.toggle('on',+s.dataset.idx===idx);
    });
    const prog=document.getElementById('prog');
    const barTitle=document.getElementById('barTitle');
    const slideCount=document.getElementById('slideCount');
    if(prog) prog.style.width=`${((idx+1)/total)*100}%`;
    if(slideCount) slideCount.textContent=`${idx+1} / ${total}`;
    if(barTitle){
      if(idx===0) barTitle.textContent='Intro';
      else barTitle.textContent=CONCEPTS[idx-1].name;
    }
    if(idx>0) location.replace(`#${idx}`);
  }

  function step(d){
    idx=(idx+d+total)%total;
    render();
  }

  function toggleAuto(){
    autoOn=!autoOn;
    document.getElementById('play').classList.toggle('on',autoOn);
    if(autoTimer) clearInterval(autoTimer);
    if(autoOn) autoTimer=setInterval(()=>step(1),4500);
  }

  document.getElementById('prev').onclick=()=>step(-1);
  document.getElementById('next').onclick=()=>step(1);
  document.getElementById('play').onclick=toggleAuto;
  window.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft') step(-1);
    if(e.key==='ArrowRight') step(1);
    if(e.key===' ') { e.preventDefault(); toggleAuto(); }
  });
  window.addEventListener('hashchange',()=>{ parseHash(); render(); });

  parseHash();
  render();
})();
