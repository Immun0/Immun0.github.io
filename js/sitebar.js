/* Core Principles site bar.
   One shared bar for every page off the main index, so a reader who arrives
   by a direct link can get home or to a section.

   Use, in each page's <head>, with the path adjusted to the page's depth:
     <script defer src="../js/sitebar.js" data-section="flow"></script>
   data-section is optional: flow, genomics, r-analysis, about or mass.
   It underlines that section in the bar.

   Links are built from this script's own location, so the bar works on the
   live site, on any other host, and from a local copy opened as a file.
   The sections and colours mirror the nav in index.html; change both together.
   When the site moves to a static site generator this becomes its shared
   header include and this file goes. */
(function () {
  var script = document.currentScript;
  var base = script.src.replace(/js\/sitebar\.js(\?.*)?$/, '');
  var current = script.getAttribute('data-section');

  // An animation panel shown inside its series page gets that page's bar;
  // only a page opened on its own draws one.
  if (window.self !== window.top) return;

  var sections = [
    ['flow', 'Flow Cytometry', '#4ABCCC'],
    ['genomics', 'Genomics', '#3267B0'],
    ['r-analysis', 'R Analysis', '#1B3A70'],
    ['about', 'About', '#CBD5E1'],
    ['mass', 'Mass Cytometry', '#7CB26A']
  ];

  var css =
    '.cp-bar{position:sticky;top:0;z-index:1000;display:flex;align-items:center;' +
    'height:48px;padding:0 16px;background:#fff;border-bottom:1px solid #E0E5ED;' +
    'font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;' +
    'overflow-x:auto;white-space:nowrap;box-sizing:border-box}' +
    '.cp-bar a{display:flex;align-items:center;gap:8px;height:100%;padding:0 14px;' +
    'font-size:13px;font-weight:500;color:#64748B;text-decoration:none;' +
    'border-bottom:2px solid transparent;box-sizing:border-box}' +
    '.cp-bar a:hover{color:#1B3A70}' +
    '.cp-bar a.cp-active{color:#1B3A70;border-bottom-color:#4ABCCC}' +
    '.cp-bar a.cp-home{padding-left:0;margin-right:8px;font-weight:600;color:#1B3A70}' +
    '.cp-bar img{width:24px;height:24px}' +
    '.cp-bar .cp-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}';

  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var bar = document.createElement('nav');
    bar.className = 'cp-bar';
    bar.setAttribute('aria-label', 'Core Principles');

    var home = document.createElement('a');
    home.className = 'cp-home';
    home.href = base;
    home.target = '_top';
    home.innerHTML = '<img src="' + base + 'Images/favicon.png" alt="">Core Principles';
    bar.appendChild(home);

    sections.forEach(function (s) {
      var a = document.createElement('a');
      a.href = base + '#' + s[0];
      a.target = '_top';
      if (s[0] === current) a.className = 'cp-active';
      a.innerHTML = '<span class="cp-dot" style="background:' + s[2] + '"></span>' + s[1];
      bar.appendChild(a);
    });

    document.body.insertBefore(bar, document.body.firstChild);

    // The animation panels pin a round logo to the top left; drop it below the bar.
    var badges = document.querySelectorAll('.brand-badge');
    for (var j = 0; j < badges.length; j++) {
      // 'important' because the panels' own rule for it is !important.
      badges[j].style.setProperty('top', (parseFloat(getComputedStyle(badges[j]).top) + bar.offsetHeight) + 'px', 'important');
    }

    // Pages that are one full-screen embed (the Canva infographics) would push
    // their bottom edge off screen; shrink those frames by the bar's height.
    var frames = document.querySelectorAll('iframe');
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].offsetHeight >= window.innerHeight - 1) {
        frames[i].style.height = 'calc(100vh - ' + bar.offsetHeight + 'px)';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
