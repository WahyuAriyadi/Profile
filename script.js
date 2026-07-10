(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.body.getAttribute('data-page') || 'index';
  // Pipeline stages shown in the sidebar nav. "index" (home) sits outside the
  // numbered pipeline — it's the landing/overview, not a stage you progress to.
  var stageIds = ['skills', 'projects', 'certifications', 'contact'];

  /* ---------- Hero terminal typewriter (home page only) ---------- */
  var termEl = document.getElementById('terminalBody');
  var hero = document.getElementById('hero');

  if(termEl && hero){
    var lines = [
      {html: '<span class="prompt">$</span> whoami', pause: 250},
      {html: 'wahyu_ariyadi', pause: 350},
      {html: '', pause: 150},
      {html: '<span class="prompt">$</span> cat role.log', pause: 250},
      {html: 'Cloud &amp; DevOps Engineer · AI/ML Enthusiast', pause: 350},
      {html: '', pause: 150},
      {html: '<span class="prompt">$</span> status --check', pause: 250},
      {html: '<span class="ok">[OK]</span> Informatics Engineering, Universitas Sebelas Maret', pause: 200},
      {html: '<span class="ok">[OK]</span> AWS &amp; Google Cloud certified', pause: 200},
      {html: '<span class="ready">[READY]</span> open to hire', pause: 100}
    ];

    function typeLine(i){
      if(i >= lines.length){ hero.classList.add('hero-revealed'); return; }
      var line = lines[i];
      var span = document.createElement('div');
      termEl.appendChild(span);
      var raw = line.html;
      var pos = 0;
      var speed = 12;

      function step(){
        pos += 3;
        if(pos >= raw.length){
          span.innerHTML = raw;
          setTimeout(function(){ typeLine(i+1); }, line.pause);
        } else {
          span.textContent = raw.replace(/<[^>]*>/g,'').slice(0, pos);
          setTimeout(step, speed);
        }
      }
      if(raw === ''){
        span.innerHTML = '&nbsp;';
        setTimeout(function(){ typeLine(i+1); }, 80);
      } else {
        step();
      }
    }

    if(reduceMotion){
      termEl.innerHTML = lines.map(function(l){ return l.html === '' ? '&nbsp;' : l.html; }).join('<br>');
      hero.classList.add('hero-revealed');
    } else {
      typeLine(0);
    }
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold: 0.15});
    revealEls.forEach(function(el){ revealObserver.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- Pipeline nav: active/done state based on current page ---------- */
  function setNavState(){
    var idx = stageIds.indexOf(page);
    document.querySelectorAll('[data-target]').forEach(function(li){
      var target = li.getAttribute('data-target');
      var tIdx = stageIds.indexOf(target);
      li.classList.remove('active', 'done');
      if(idx === -1) return; // on home page, pipeline hasn't started yet
      if(tIdx < idx) li.classList.add('done');
      else if(tIdx === idx) li.classList.add('active');
    });
    var trackFill = document.getElementById('trackFill');
    if(trackFill && idx > -1){
      var pct = stageIds.length > 1 ? (idx / (stageIds.length - 1)) * 100 : 0;
      setTimeout(function(){ trackFill.style.height = pct + '%'; }, 200);
    }
  }
  setNavState();

  /* ---------- Mobile top progress bar (scroll depth on current page) ---------- */
  var mobileProgress = document.getElementById('mobileProgress');
  function updateMobileProgress(){
    if(!mobileProgress) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    mobileProgress.style.width = pct + '%';
  }
  window.addEventListener('scroll', function(){
    window.requestAnimationFrame(updateMobileProgress);
  }, {passive:true});
  updateMobileProgress();

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.getElementById('mobileToggle');
  var overlay = document.getElementById('mobileOverlay');
  if(toggle && overlay){
    toggle.addEventListener('click', function(){
      var open = overlay.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    overlay.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        overlay.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();
