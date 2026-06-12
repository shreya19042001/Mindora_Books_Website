/* ════════════════════════════════════════════
   MINDORA BOOKS — app-cosmic.js
   Cosmic Ambient Engine
   Add <script src="app-cosmic.js"></script>
   AFTER <script src="app.js"></script> in index.html
════════════════════════════════════════════ */

(function CosmicAmbient() {
  'use strict';

  function injectElements() {
    const grain = document.createElement('div');
    grain.id = 'grainOverlay';
    document.body.prepend(grain);

    const canvas = document.createElement('canvas');
    canvas.id = 'cosmicCanvas';
    document.body.prepend(canvas);

    // Aurora bands in content sections only
    ['about','benefits','quality'].forEach(id => {
      const sec = document.getElementById(id);
      if (!sec) return;
      const band = document.createElement('div');
      band.className = 'aurora-band';
      sec.insertBefore(band, sec.firstChild);
    });

    // Nebula orbs
    const nebulaDefs = [
      { section:'about',    color:'rgba(120,40,200,0.6)',  size:500, top:'5%',  left:'60%', delay:0 },
      { section:'about',    color:'rgba(245,200,66,0.5)', size:350, top:'55%', left:'10%', delay:5 },
      { section:'benefits', color:'rgba(56,189,248,0.5)', size:420, top:'20%', left:'75%', delay:2 },
      { section:'benefits', color:'rgba(100,220,100,0.4)',size:300, top:'60%', left:'20%', delay:8 },
      { section:'quality',  color:'rgba(249,115,22,0.5)', size:380, top:'30%', left:'50%', delay:3 },
      { section:'for-whom', color:'rgba(196,181,253,0.5)',size:450, top:'10%', left:'30%', delay:6 },
      { section:'contact',  color:'rgba(245,200,66,0.4)', size:320, top:'40%', left:'70%', delay:1 },
    ];
    nebulaDefs.forEach(def => {
      const sec = document.getElementById(def.section);
      if (!sec) return;
      const orb = document.createElement('div');
      orb.className = 'nebula-orb';
      orb.style.cssText = `
        width:${def.size}px;height:${def.size}px;
        background:${def.color};
        top:${def.top};left:${def.left};
        transform:translate(-50%,-50%);
        animation-delay:${def.delay}s;
      `;
      sec.insertBefore(orb, sec.firstChild);
    });
  }

  function initStarField() {
    const canvas = document.getElementById('cosmicCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const layers = [
      { count:280, sizeRange:[0.3,0.8],  speed:0.008, alpha:[0.15,0.45] },
      { count:120, sizeRange:[0.6,1.4],  speed:0.018, alpha:[0.25,0.65] },
      { count: 45, sizeRange:[1.0,2.2],  speed:0.032, alpha:[0.4, 0.85] },
    ];
    let stars = [], W, H, scrollY = 0;

    function buildStars() {
      stars = [];
      layers.forEach((l, li) => {
        for (let i = 0; i < l.count; i++) {
          stars.push({
            x: Math.random()*W, y: Math.random()*H,
            r: l.sizeRange[0] + Math.random()*(l.sizeRange[1]-l.sizeRange[0]),
            baseAlpha: l.alpha[0] + Math.random()*(l.alpha[1]-l.alpha[0]),
            twinkleOffset: Math.random()*Math.PI*2,
            twinkleSpeed: 0.4 + Math.random()*0.8,
            layer: li, speed: l.speed,
          });
        }
      });
    }

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildStars();
    }

    function draw() {
      const t = Date.now()/1000;
      ctx.clearRect(0,0,W,H);
      const grad = ctx.createLinearGradient(0,0,0,H);
      grad.addColorStop(0,'#000000');
      grad.addColorStop(0.3,'#02000a');
      grad.addColorStop(0.6,'#040010');
      grad.addColorStop(1,'#000000');
      ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

      const neb = ctx.createRadialGradient(W*0.3,H*0.4,0,W*0.3,H*0.4,W*0.6);
      neb.addColorStop(0,'rgba(60,0,120,0.035)');
      neb.addColorStop(0.5,'rgba(20,0,60,0.018)');
      neb.addColorStop(1,'transparent');
      ctx.fillStyle = neb; ctx.fillRect(0,0,W,H);

      const neb2 = ctx.createRadialGradient(W*0.75,H*0.6,0,W*0.75,H*0.6,W*0.45);
      neb2.addColorStop(0,'rgba(0,30,80,0.028)');
      neb2.addColorStop(1,'transparent');
      ctx.fillStyle = neb2; ctx.fillRect(0,0,W,H);

      stars.forEach(s => {
        const parallaxY = (scrollY*s.speed)%H;
        let ry = s.y - parallaxY;
        if(ry<0) ry+=H; if(ry>H) ry-=H;
        const twinkle = 0.5 + 0.5*Math.sin(t*s.twinkleSpeed+s.twinkleOffset);
        const alpha = s.baseAlpha*(0.55+0.45*twinkle);
        ctx.beginPath();
        ctx.arc(s.x,ry,s.r,0,Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fill();
        if(s.r>1.4){
          ctx.beginPath();
          ctx.arc(s.x,ry,s.r*3.5,0,Math.PI*2);
          const glow = ctx.createRadialGradient(s.x,ry,0,s.x,ry,s.r*3.5);
          glow.addColorStop(0,`rgba(255,255,255,${(alpha*0.18).toFixed(3)})`);
          glow.addColorStop(1,'transparent');
          ctx.fillStyle = glow; ctx.fill();
        }
      });
      requestAnimationFrame(draw);
    }

    window.addEventListener('scroll',()=>{ scrollY=window.scrollY; },{passive:true});
    window.addEventListener('resize',resize);
    resize();
    draw();
  }

  function initShootingStars() {
    function spawnStar() {
      const el = document.createElement('div');
      el.className = 'shooting-star';
      document.body.appendChild(el);
      const startX = Math.random()*window.innerWidth;
      const startY = Math.random()*window.innerHeight*0.5;
      const angle  = 20+Math.random()*30;
      const dist   = 200+Math.random()*350;
      const rad    = angle*Math.PI/180;
      const endX   = startX+Math.cos(rad)*dist;
      const endY   = startY+Math.sin(rad)*dist;
      const dur    = 600+Math.random()*800;
      el.style.cssText = `left:${startX}px;top:${startY}px;opacity:0;transform:rotate(${angle}deg);`;
      const tail = document.createElement('div');
      tail.style.cssText = `position:absolute;top:50%;right:0;transform:translateY(-50%);height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.7));width:0;transition:width ${dur*0.4}ms ease;`;
      el.appendChild(tail);
      const start = performance.now();
      function step(now) {
        const t = Math.min((now-start)/dur,1);
        const ease = t<0.5?2*t*t:-1+(4-2*t)*t;
        const cx = startX+(endX-startX)*ease;
        const cy = startY+(endY-startY)*ease;
        const alpha = t<0.15?t/0.15:t>0.75?1-(t-0.75)/0.25:1;
        el.style.left=cx+'px'; el.style.top=cy+'px'; el.style.opacity=alpha;
        if(t<0.1) tail.style.width=(t/0.1*70)+'px';
        if(t<1) requestAnimationFrame(step);
        else el.remove();
      }
      requestAnimationFrame(step);
      requestAnimationFrame(()=>{ tail.style.width='70px'; });
      setTimeout(spawnStar, 3500+Math.random()*8000);
    }
    setTimeout(spawnStar, 2000);
    setTimeout(spawnStar, 5500);
    setTimeout(spawnStar, 9000);
  }

  function initAuroraReveal() {
    const bands = document.querySelectorAll('.aurora-band');
    if(!bands.length) return;
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ e.target.classList.toggle('visible',e.isIntersecting); });
    },{threshold:0.1});
    bands.forEach(b=>obs.observe(b));
  }

  function initMouseParallax() {
    let mx=0, my=0;
    window.addEventListener('mousemove',e=>{
      mx=(e.clientX/window.innerWidth-0.5)*2;
      my=(e.clientY/window.innerHeight-0.5)*2;
    },{passive:true});
    const orbs = document.querySelectorAll('.nebula-orb');
    function updateOrbs() {
      orbs.forEach((orb,i)=>{
        const depth = 0.4+(i%3)*0.3;
        orb.style.transform = `translate(calc(-50% + ${mx*12*depth}px),calc(-50% + ${my*8*depth}px))`;
      });
      requestAnimationFrame(updateOrbs);
    }
    updateOrbs();
  }

  function injectDividers() {
    // BUG FIX: #showcaseSection intentionally excluded here.
    // It has its own ::before (bottom ground-gradient) in style-carousel.css.
    // Adding .section-glow-divider would conflict with that ::before rule.
    const secs = ['#about','#benefits','#products','#quality','#for-whom','#contact'];
    secs.forEach(sel=>{
      const el = document.querySelector(sel);
      if(el) el.classList.add('section-glow-divider');
    });
  }

  function init() {
    injectElements();
    injectDividers();
    initStarField();
    initShootingStars();
    initAuroraReveal();
    initMouseParallax();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init);
  } else {
    init();
  }

})();
