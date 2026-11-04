/** Shared phone mock markup + chrome toggles for concepts.html and slides.html */
window.AH_PHONE_MOCK_INNER=`
<div class="scene"></div>
<div class="m-grad"></div>
<div class="mock mock-car">
  <header class="m-top">
    <span class="m-mast">AFTERHOURS</span>
    <span class="m-tools"><span>Issue 01</span><span>Glow</span><span>Rivals</span><span>Sound</span></span>
  </header>
  <div class="chiprow hidden mock-chips">
    <span class="chip">STREET</span><span class="chip">GLOW</span><span class="chip">SND</span>
  </div>
  <nav class="dock hidden mock-dock" aria-hidden="true">
    <span class="on">Cars</span><span>Events</span><span>Glow on</span><span>Rivals</span><span>Sound</span>
  </nav>
  <h2 class="m-hl"><span class="k">Specimen 01</span><span>KAGE R</span></h2>
  <div class="m-stamp">Tunnel pick</div>
  <div class="m-hand">swipe the lot →</div>
  <div class="gauge hidden mock-gauge" aria-hidden="true"></div>
  <footer class="m-foot">
    <div class="m-specs">AWD · 420 HP · 3,120 LB · MIDSHIP</div>
    <div class="m-stats">
      <div>Launch<div class="m-bar"><i style="width:78%"></i></div></div>
      <div>Top end<div class="m-bar"><i style="width:65%"></i></div></div>
      <div>Grip<div class="m-bar"><i style="width:82%"></i></div></div>
    </div>
    <div class="m-rule"></div>
    <div class="m-cap">Harbor Line at 03:12 — tunnel lights, wet asphalt, four rivals pacing you.</div>
    <div class="m-actions">
      <div class="m-nav"><i>←</i><i>→</i></div>
      <div class="m-cta">Race this car</div>
    </div>
  </footer>
</div>`;

window.applyConceptChrome=function(conceptId,phoneEl){
  if(!phoneEl) return;
  phoneEl.dataset.concept=conceptId;
  const isGlass=/glass/.test(conceptId)&&conceptId!=='issue-neon';
  const isCock=/cockpit/.test(conceptId);
  const dock=phoneEl.querySelector('.mock-dock');
  const chips=phoneEl.querySelector('.mock-chips');
  const gauge=phoneEl.querySelector('.mock-gauge');
  const tools=phoneEl.querySelector('.m-tools');
  if(dock){
    dock.classList.toggle('hidden',!isGlass);
    dock.setAttribute('aria-hidden',isGlass?'false':'true');
  }
  if(chips) chips.classList.toggle('hidden',!isCock);
  if(gauge) gauge.classList.toggle('hidden',!isCock);
  if(tools) tools.classList.toggle('hidden',isCock);
};
