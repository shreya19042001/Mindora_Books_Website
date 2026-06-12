/* ════════════════════════════════════════════
   MINDORA BOOKS — app.js v6.0
   TOONHUB-style Book Carousel + Video Hero
════════════════════════════════════════════ */

/* ──────────────────────────────────────────
   BOOK DATA
────────────────────────────────────────── */
const BOOKS = [
  {
    key:'gods', title:'Indian Gods\nColoring Book',
    isbn:'ISBN: 978-9358139754',
    cover:'images/b1-cover.png', backCover:'images/b1-p6.png',
    pages:[
      {src:'images/b1-p2.png', label:'Little Krishna (Colored)'},
      {src:'images/b1-p3.png', label:'Little Krishna (Coloring Page)'},
      {src:'images/b1-p4.png', label:'Radha Krishna (Colored)'},
      {src:'images/b1-p5.png', label:'Radha Krishna (Coloring Page)'}
    ],
    desc:'Sacred illustrations of Ganesha, Krishna, Hanuman & Durga — crafted for children 5–15 to explore India\'s spiritual heritage through color.',
    feats:['32 premium thick pages','Ganesha, Krishna, Hanuman, Durga & more','Educational & culturally enriching','Perfect festival gift'],
    bg:'#0d0020',
    accent:'#ffd700',
    accentRgb:'255,215,0',
    badge:'✦ Indian Culture',
    links:{
      amazon:'https://www.amazon.in/Indian-Gods-Coloring-Mindora-Books/dp/9358139757/',
      flipkart:'https://www.flipkart.com',
      meesho:'https://www.meesho.com',
      whatsapp:'https://wa.me/message/X7ZU3AQVL5SPB1'
    }
  },
  {
    key:'zoo', title:'Zooland\nAnimal Coloring Book',
    isbn:'ISBN: 978-93-5913-961-6',
    cover:'images/b2-cover.png', backCover:'images/b2-p6.png',
    pages:[
      {src:'images/b2-p2.png', label:'Kitty in the Garden (Colored)'},
      {src:'images/b2-p3.png', label:'Kitty in the Garden (Coloring Page)'},
      {src:'images/b2-p4.png', label:'Bunny with Carrot (Colored)'},
      {src:'images/b2-p5.png', label:'Bunny with Carrot (Coloring Page)'}
    ],
    desc:'Go on a safari through jungles & grasslands with elephants, monkeys, giraffes, lions & more adorable animals. Perfect for young wildlife lovers!',
    feats:['Elephant, monkey, giraffe, lion & more','Vibrant jungle & river-themed scenes','Promotes creativity & love for wildlife','Ages 5–15, sturdy thick pages'],
    bg:'#001a08',
    accent:'#34d399',
    accentRgb:'52,211,153',
    badge:'🌿 Wildlife',
    links:{
      amazon:'https://www.amazon.in',
      flipkart:'https://www.flipkart.com',
      meesho:'https://www.meesho.com',
      whatsapp:'https://wa.me/message/X7ZU3AQVL5SPB1'
    }
  },
  {
    key:'sea', title:'Cute Sea Animals\nColoring Book',
    isbn:'ISBN: 978-9358955286',
    cover:'images/b3-cover.png', backCover:'images/b3-p6.png',
    pages:[
      {src:'images/b3-p2.png', label:'Gold Fish (Colored)'},
      {src:'images/b3-p3.png', label:'Gold Fish (Coloring Page)'},
      {src:'images/b3-p4.png', label:'Seahorse (Colored)'},
      {src:'images/b3-p5.png', label:'Seahorse (Coloring Page)'}
    ],
    desc:'Dive into the sparkling ocean with dolphins, jellyfish, crabs, starfish, seahorses & more. Every page is an underwater adventure!',
    feats:['25+ cute ocean animals to color','Gold fish, seahorse, dolphin, jellyfish & more','Big, bold & easy designs','Boosts creativity and focus — Ages 5–15'],
    bg:'#000d20',
    accent:'#38bdf8',
    accentRgb:'56,189,248',
    badge:'🌊 Ocean World',
    links:{
      amazon:'https://www.amazon.in/Cute-Sea-Animals-Coloring-Book/dp/9358955287/',
      flipkart:'https://www.flipkart.com',
      meesho:'https://www.meesho.com',
      whatsapp:'https://wa.me/message/X7ZU3AQVL5SPB1'
    }
  }
];

/* ──────────────────────────────────────────
   STATE
────────────────────────────────────────── */
let carouselActive  = 0;
let carouselAnimating = false;
let exploreOpen     = false;
let exploreCurrent  = 0;
const FADE_MS       = 500;

/* ══════════════════════════════════════════
   HERO VIDEO — JS crossfade
══════════════════════════════════════════ */
(function initHeroVideo(){
  const video = document.getElementById('heroBgVideo');
  if(!video) return;
  let rafId = null;
  let fadingOutRef = false;

  function fadeTo(target, duration){
    cancelAnimationFrame(rafId);
    const start     = parseFloat(video.style.opacity) || 0;
    const startTime = performance.now();
    function step(now){
      const t = Math.min((now - startTime) / duration, 1);
      video.style.opacity = start + (target - start) * t;
      if(t < 1) rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
  }

  video.addEventListener('loadeddata', () => {
    video.style.opacity = '0';
    video.play().catch(()=>{});
    fadeTo(1, FADE_MS);
  });
  video.addEventListener('timeupdate', () => {
    if(!fadingOutRef && video.duration){
      const rem = video.duration - video.currentTime;
      if(rem <= 0.55 && rem > 0){ fadingOutRef = true; fadeTo(0, FADE_MS); }
    }
  });
  video.addEventListener('ended', () => {
    video.style.opacity = '0';
    setTimeout(()=>{
      video.currentTime = 0;
      video.play().catch(()=>{});
      fadingOutRef = false;
      fadeTo(1, FADE_MS);
    }, 100);
  });
})();

/* ══════════════════════════════════════════
   INTRO CLEANUP
══════════════════════════════════════════ */
setTimeout(()=>{
  const el = document.getElementById('intro-screen');
  if(el) el.style.display = 'none';
}, 4200);

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
window.addEventListener('scroll',()=>{
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 55);
});
function toggleMenu(){
  document.getElementById('mobile-menu').classList.toggle('open');
}

/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
const revObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:0.08});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

/* ══════════════════════════════════════════
   SHOP BUTTONS SVG
══════════════════════════════════════════ */
const SVG_ICONS = {
  amz:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.699-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074-1.047-.872-1.234-1.276-1.814-2.106-1.734 1.767-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.095v-.41c0-.753.06-1.642-.383-2.294-.385-.579-1.124-.82-1.775-.82-1.205 0-2.277.618-2.54 1.897-.054.285-.261.567-.549.582l-3.061-.329c-.259-.057-.548-.266-.472-.66C5.8 1.794 8.982.5 11.827.5c1.448 0 3.34.385 4.483 1.479 1.448 1.352 1.308 3.154 1.308 5.117v4.631c0 1.391.577 2.002 1.121 2.753.19.267.231.587-.01.785l-1.585 1.53zm3.606 3.417c-2.07 1.608-5.074 2.462-7.658 2.462-3.624 0-6.886-1.34-9.354-3.569-.194-.176-.021-.416.213-.279 2.664 1.549 5.954 2.481 9.354 2.481 2.293 0 4.813-.476 7.133-1.458.349-.151.642.229.312.363zm.893-1.004c-.264-.339-1.748-.161-2.415-.08-.202.024-.233-.152-.051-.28 1.183-.831 3.125-.592 3.353-.313.229.282-.062 2.232-1.168 3.163-.17.143-.332.066-.256-.119.248-.623.808-2.013.537-2.371z"/></svg>`,
  fk:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 0C5.01 0 3 2.01 3 4.5v15C3 21.99 5.01 24 7.5 24h9c2.49 0 4.5-2.01 4.5-4.5v-15C21 2.01 18.99 0 16.5 0h-9zm4.5 3l4 4-4 4V8H9v3.5L5 7.5 9 3.5V6h3V3zm0 18l-4-4 4-4v3h3v-3.5l4 3.5-4 4v-2.5h-3V21z"/></svg>`,
  ms:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.33c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.891z"/></svg>`,
  wa:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`
};

/* ══════════════════════════════════════════
   TOONHUB CAROUSEL ENGINE
══════════════════════════════════════════ */

function isMobile(){ return window.innerWidth < 640; }

function getBookStyle(role){
  const mob = isMobile();
  if(role === 'center') return {
    transform:`translateX(-50%) scale(${mob ? 1.0 : 1.22})`,
    filter:'none',
    opacity:'1',
    zIndex:'20',
    left:'50%',
    height: mob ? '48%' : '65%',
    bottom: mob ? '18%' : '8%',
  };
  if(role === 'left') return {
    transform:`translateX(-50%) scale(1)`,
    filter:'blur(3px) brightness(0.55)',
    opacity:'0.8',
    zIndex:'10',
    left: mob ? '18%' : '27%',
    height: mob ? '22%' : '30%',
    bottom: mob ? '24%' : '12%',
  };
  if(role === 'right') return {
    transform:`translateX(-50%) scale(1)`,
    filter:'blur(3px) brightness(0.55)',
    opacity:'0.8',
    zIndex:'10',
    left: mob ? '82%' : '73%',
    height: mob ? '22%' : '30%',
    bottom: mob ? '24%' : '12%',
  };
  // hidden
  return { opacity:'0', zIndex:'0', left:'50%', height:'0', transform:'translateX(-50%)' };
}

function applyBookStyles(){
  const n = BOOKS.length;
  const left  = (carouselActive + n - 1) % n;
  const right = (carouselActive + 1) % n;
  const roles = {};
  roles[carouselActive] = 'center';
  roles[left]           = 'left';
  roles[right]          = 'right';

  BOOKS.forEach((_, i) => {
    const el = document.getElementById('cBook' + i);
    if(!el) return;
    const role  = roles[i] || 'hidden';
    const style = getBookStyle(role);
    Object.assign(el.style, style);
  });
}

function applyInfoPanel(idx, animate){
  const b = BOOKS[idx];
  const title  = document.getElementById('cTitle');
  const isbn   = document.getElementById('cIsbn');
  const desc   = document.getElementById('cDesc');
  const badge  = document.getElementById('cBadge');
  const feats  = document.getElementById('cFeats');
  const shopBtns = document.getElementById('cShopBtns');
  const buyLink  = document.getElementById('cBuyLink');

  if(animate){
    [title, desc].forEach(el => {
      if(!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
    });
  }

  setTimeout(() => {
    if(badge)  { badge.textContent = b.badge; badge.style.borderColor = b.accent + '55'; badge.style.color = b.accent; }
    if(isbn)   isbn.textContent = b.isbn;
    if(title)  { title.innerHTML = b.title.replace('\n', '<br>'); }
    if(desc)   desc.textContent = b.desc;
    if(feats)  feats.innerHTML  = b.feats.map(f => `<li>${f}</li>`).join('');

    // Shop buttons
    if(shopBtns){
      const L = b.links;
      shopBtns.innerHTML =
        `<a href="${L.amazon}"   target="_blank" class="shop-btn s-amz">${SVG_ICONS.amz} Amazon</a>
         <a href="${L.flipkart}" target="_blank" class="shop-btn s-fk">${SVG_ICONS.fk}  Flipkart</a>
         <a href="${L.meesho}"   target="_blank" class="shop-btn s-ms">${SVG_ICONS.ms}  Meesho</a>
         <a href="${L.whatsapp}" target="_blank" class="shop-btn s-wa">${SVG_ICONS.wa}  WhatsApp</a>`;
    }

    if(buyLink){ buyLink.href = b.links.amazon; }

    if(animate){
      setTimeout(() => {
        if(title){ title.style.opacity = '1'; title.style.transform = 'none'; }
        if(desc) { desc.style.opacity  = '1'; desc.style.transform  = 'none'; }
      }, 40);
    }
  }, animate ? 200 : 0);
}

function applyBackground(idx){
  const b   = BOOKS[idx];
  const sec = document.getElementById('showcaseSection');
  if(sec) sec.style.backgroundColor = b.bg;

  // Glow orb
  const orb = document.getElementById('cGlowOrb');
  if(orb) orb.style.background =
    `radial-gradient(ellipse at 50% 35%, rgba(${b.accentRgb},0.14) 0%, transparent 65%)`;

  // Accent line
  const line = document.getElementById('cAccentLine');
  if(line) line.style.background =
    `linear-gradient(90deg,transparent 0%,rgba(${b.accentRgb},0.5) 35%,rgba(${b.accentRgb},0.5) 65%,transparent 100%)`;
}

function applyDots(idx){
  document.querySelectorAll('.c-dot').forEach((d, i) => {
    const isActive = i === idx;
    d.classList.toggle('active', isActive);
    d.style.background = isActive ? BOOKS[idx].accent : 'rgba(255,255,255,0.28)';
    d.style.width = isActive ? '22px' : '7px';
  });
}

function carouselNavigate(dir){
  if(carouselAnimating) return;
  carouselAnimating = true;

  const n = BOOKS.length;
  carouselActive = dir === 'next'
    ? (carouselActive + 1) % n
    : (carouselActive + n - 1) % n;

  applyBookStyles();
  applyBackground(carouselActive);
  applyDots(carouselActive);
  applyInfoPanel(carouselActive, true);

  setTimeout(() => { carouselAnimating = false; }, 700);
}

function carouselGoTo(idx){
  if(carouselAnimating || idx === carouselActive) return;
  carouselAnimating = true;
  carouselActive    = idx;

  applyBookStyles();
  applyBackground(idx);
  applyDots(idx);
  applyInfoPanel(idx, true);

  setTimeout(() => { carouselAnimating = false; }, 700);
}

function initCarousel(){
  // Set CSS transitions on all book items
  BOOKS.forEach((_, i) => {
    const el = document.getElementById('cBook' + i);
    if(!el) return;
    el.style.transition = [
      'transform 700ms cubic-bezier(0.4,0,0.2,1)',
      'filter    700ms cubic-bezier(0.4,0,0.2,1)',
      'opacity   700ms cubic-bezier(0.4,0,0.2,1)',
      'left      700ms cubic-bezier(0.4,0,0.2,1)',
      'bottom    700ms cubic-bezier(0.4,0,0.2,1)',
      'height    700ms cubic-bezier(0.4,0,0.2,1)',
    ].join(',');
    el.style.willChange = 'transform,filter,opacity,left,bottom,height';
  });

  // Set title/desc transitions
  ['cTitle','cDesc'].forEach(id => {
    const el = document.getElementById(id);
    if(el){ el.style.transition = 'opacity 320ms ease, transform 320ms ease'; }
  });

  applyBookStyles();
  applyBackground(0);
  applyDots(0);
  applyInfoPanel(0, false);

  // Resize → re-apply styles
  window.addEventListener('resize', () => applyBookStyles());

  // Keyboard
  document.addEventListener('keydown', e => {
    if(exploreOpen){
      if(e.key==='ArrowRight') explorerGo(exploreCurrent+1);
      if(e.key==='ArrowLeft')  explorerGo(exploreCurrent-1);
      if(e.key==='Escape')     closeExplore();
    } else {
      if(e.key==='ArrowRight') carouselNavigate('next');
      if(e.key==='ArrowLeft')  carouselNavigate('prev');
    }
  });

  // Preload all images
  BOOKS.forEach(b => {
    [b.cover, b.backCover, ...b.pages.map(p => p.src)].forEach(src => {
      const img = new Image();
      img.src = src;
    });
  });
}

/* ══════════════════════════════════════════
   EXPLORE MODAL
══════════════════════════════════════════ */
function openExplore(){
  exploreOpen = true;
  const modal = document.getElementById('exploreModal');
  if(!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const b = BOOKS[carouselActive];
  const allItems = [
    {src:b.cover,     label:'Front Cover'},
    ...b.pages,
    {src:b.backCover, label:'Back Cover'}
  ];
  const dotsEl = document.getElementById('exploreDots');
  if(dotsEl) dotsEl.innerHTML = allItems.map((_,i) =>
    `<button class="exp-dot${i===0?' active':''}" onclick="explorerGo(${i})"></button>`
  ).join('');
  explorerGo(0);
}

function closeExplore(){
  exploreOpen = false;
  const modal = document.getElementById('exploreModal');
  if(modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function explorerGo(n){
  const b = BOOKS[carouselActive];
  const allItems = [
    {src:b.cover, label:'Front Cover'},
    ...b.pages,
    {src:b.backCover, label:'Back Cover'}
  ];
  exploreCurrent = ((n % allItems.length) + allItems.length) % allItems.length;
  const item = allItems[exploreCurrent];
  const img  = document.getElementById('exploreImg');
  if(img){
    img.style.opacity   = '0';
    img.style.transform = 'scale(0.96)';
    img.src   = item.src;
    img.alt   = item.label;
    img.onload = () => { img.style.opacity = '1'; img.style.transform = 'scale(1)'; };
    if(img.complete){ img.style.opacity = '1'; img.style.transform = 'scale(1)'; }
  }
  const cap = document.getElementById('exploreCaption');
  if(cap) cap.textContent = item.label;
  const ctr = document.getElementById('exploreCounter');
  if(ctr) ctr.textContent = `${exploreCurrent+1} / ${allItems.length}`;
  document.querySelectorAll('.exp-dot').forEach((d,i) => {
    d.classList.toggle('active', i === exploreCurrent);
  });
}

/* ══════════════════════════════════════════
   SMOOTH SCROLL (delegated, robust)
══════════════════════════════════════════ */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if(!link) return;

  const id = link.getAttribute('href');
  if(!id || id === '#' || id.length < 2) return;

  let target;
  try { target = document.querySelector(id); } catch(err) { return; }
  if(!target) return;

e.preventDefault();
const navH = document.getElementById('navbar')?.offsetHeight || 70;
const top = target.getBoundingClientRect().top + window.scrollY - navH;
window.scrollTo({ top, behavior: 'smooth' });

  const mobileMenu = document.getElementById('mobile-menu');
  if(mobileMenu && mobileMenu.classList.contains('open')){
    mobileMenu.classList.remove('open');
  }
});
/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
});
