// ============================================================
// SOVEREIGN SYNTHESIS — AUTH GATE
// Handles magic link auth + tier access control on portal pages
// Requires: supabase-js v2 loaded via CDN before this script
// Config:  window.SS_TIER_SLUG must be set before this script
// ============================================================

(function () {
  'use strict';

  var SUPABASE_URL = 'https://wzthxohtgojenukmdubz.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6dGh4b2h0Z29qZW51a21kdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzY1ODcsImV4cCI6MjA4OTQ1MjU4N30.YaUrxPCBKGWscbebkdekDvRMGb_eFD0yRTVaM8C2frU';

  var TIER_SLUG = window.SS_TIER_SLUG;
  if (!TIER_SLUG) return;

  // Tier hierarchy — who can access what
  // Inner Circle ($12K) gets everything
  // Architect tiers are cumulative: dp3 includes dp1+dp2, dp2 includes dp1
  // P77 and Manifesto are standalone
  var TIER_NUMBERS = { p77: 2, manifesto: 3, dp1: 4, dp2: 5, dp3: 6, inner_circle: 7 };

  function hasAccessToTier(userTiers, requiredTier) {
    if (userTiers.indexOf('inner_circle') !== -1) return true;
    if (userTiers.indexOf(requiredTier) !== -1) return true;
    // Architect tier hierarchy: higher phase includes lower phases
    if (requiredTier === 'dp1' || requiredTier === 'dp2' || requiredTier === 'dp3') {
      var reqNum = TIER_NUMBERS[requiredTier];
      for (var i = 0; i < userTiers.length; i++) {
        var t = userTiers[i];
        if ((t === 'dp1' || t === 'dp2' || t === 'dp3') && TIER_NUMBERS[t] >= reqNum) return true;
      }
    }
    return false;
  }

  // ── INITIALIZE SUPABASE ──────────────────────────────────
  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ── DOM HELPERS ──────────────────────────────────────────
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return document.querySelectorAll(sel); }

  // Get page-specific accent color from CSS var
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#E5850F';

  // ── BUILD AUTH OVERLAY ───────────────────────────────────
  var overlay = document.createElement('div');
  overlay.id = 'ss-auth-overlay';
  overlay.innerHTML = [
    '<div class="ss-auth-card">',
    '  <div class="ss-auth-badge">SOVEREIGN SYNTHESIS</div>',
    '  <h2 class="ss-auth-title">Access Your Portal</h2>',
    '  <p class="ss-auth-desc">Enter the email you used to purchase. We\'ll send you a magic link to unlock your content.</p>',
    '  <form id="ss-auth-form">',
    '    <input type="email" id="ss-auth-email" placeholder="your@email.com" required autocomplete="email" />',
    '    <button type="submit" id="ss-auth-submit">SEND MAGIC LINK</button>',
    '  </form>',
    '  <div id="ss-auth-status" class="ss-auth-status"></div>',
    '  <div class="ss-auth-footer">',
    '    <p>Don\'t have access? <a href="/" class="ss-auth-link">View products</a></p>',
    '  </div>',
    '</div>'
  ].join('\n');

  // ── STYLES ───────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '#ss-auth-overlay {',
    '  position: fixed; top: 0; left: 0; width: 100%; height: 100%;',
    '  background: rgba(10,10,15,0.95); backdrop-filter: blur(12px);',
    '  display: flex; align-items: center; justify-content: center;',
    '  z-index: 10000; opacity: 0; transition: opacity 0.4s ease;',
    '  font-family: "EB Garamond", Georgia, serif;',
    '}',
    '#ss-auth-overlay.visible { opacity: 1; }',
    '[data-theme="light"] #ss-auth-overlay { background: rgba(245,244,240,0.95); }',
    '.ss-auth-card {',
    '  max-width: 440px; width: 90%; padding: 48px 40px; text-align: center;',
    '  background: var(--bg-card, #111118); border: 1px solid var(--border, #1a1a24);',
    '}',
    '.ss-auth-badge {',
    '  font-family: "Courier Prime", "Courier New", monospace;',
    '  font-size: 10px; letter-spacing: 3px; color: ' + accent + ';',
    '  border: 1px solid ' + accent + '40; padding: 5px 14px;',
    '  display: inline-block; margin-bottom: 28px;',
    '}',
    '.ss-auth-title {',
    '  font-size: 26px; font-weight: 600; color: #fff; margin-bottom: 12px;',
    '}',
    '[data-theme="light"] .ss-auth-title { color: #111; }',
    '.ss-auth-desc {',
    '  font-size: 16px; color: var(--text-dim, #888); line-height: 1.7;',
    '  margin-bottom: 32px;',
    '}',
    '#ss-auth-form { display: flex; flex-direction: column; gap: 12px; }',
    '#ss-auth-email {',
    '  width: 100%; padding: 14px 18px; font-size: 16px;',
    '  font-family: "Courier Prime", monospace; letter-spacing: 0.5px;',
    '  background: var(--bg, #0a0a0f); color: var(--text, #e8e8e8);',
    '  border: 1px solid var(--border, #1a1a24); outline: none;',
    '  transition: border-color 0.2s;',
    '}',
    '#ss-auth-email:focus { border-color: ' + accent + '; }',
    '#ss-auth-email::placeholder { color: var(--text-dim, #888); opacity: 0.5; }',
    '#ss-auth-submit {',
    '  padding: 14px 40px; font-family: "Courier Prime", monospace;',
    '  font-size: 13px; font-weight: bold; letter-spacing: 2px;',
    '  text-transform: uppercase; cursor: pointer;',
    '  background: ' + accent + '; color: #0a0a0f; border: none;',
    '  transition: opacity 0.2s;',
    '}',
    '#ss-auth-submit:hover { opacity: 0.85; }',
    '#ss-auth-submit:disabled { opacity: 0.5; cursor: not-allowed; }',
    '.ss-auth-status {',
    '  margin-top: 20px; font-family: "Courier Prime", monospace;',
    '  font-size: 13px; letter-spacing: 0.5px; min-height: 20px;',
    '}',
    '.ss-auth-status.success { color: #2ECC8F; }',
    '.ss-auth-status.error { color: #D95555; }',
    '.ss-auth-status.info { color: ' + accent + '; }',
    '.ss-auth-footer {',
    '  margin-top: 32px; padding-top: 24px;',
    '  border-top: 1px solid var(--border, #1a1a24);',
    '}',
    '.ss-auth-footer p {',
    '  font-family: "Courier Prime", monospace; font-size: 12px;',
    '  color: var(--text-dim, #888); letter-spacing: 0.5px;',
    '}',
    '.ss-auth-link { color: ' + accent + '; text-decoration: none; }',
    '.ss-auth-link:hover { text-decoration: underline; }',
    '',
    '/* No-access state */',
    '.ss-no-access {',
    '  background: var(--bg-card, #111118); border: 1px solid var(--border, #1a1a24);',
    '  padding: 40px; text-align: center; margin: 48px 0;',
    '}',
    '.ss-no-access h3 { font-size: 20px; color: #fff; margin-bottom: 12px; }',
    '[data-theme="light"] .ss-no-access h3 { color: #111; }',
    '.ss-no-access p { color: var(--text-dim, #888); margin-bottom: 24px; font-size: 16px; line-height: 1.7; }',
    '.ss-no-access .ss-user-email {',
    '  font-family: "Courier Prime", monospace; font-size: 12px;',
    '  color: var(--text-dim, #888); margin-top: 16px; letter-spacing: 0.5px;',
    '}',
    '.ss-no-access .ss-signout {',
    '  display: inline-block; margin-top: 12px; font-family: "Courier Prime", monospace;',
    '  font-size: 11px; color: var(--text-dim, #888); cursor: pointer;',
    '  background: none; border: 1px solid var(--border, #1a1a24); padding: 6px 16px;',
    '  letter-spacing: 1px; transition: border-color 0.2s;',
    '}',
    '.ss-no-access .ss-signout:hover { border-color: ' + accent + '; color: ' + accent + '; }',
    '',
    '/* Loading state */',
    '#ss-auth-loading {',
    '  position: fixed; top: 0; left: 0; width: 100%; height: 100%;',
    '  background: var(--bg, #0a0a0f); display: flex;',
    '  align-items: center; justify-content: center; z-index: 9999;',
    '}',
    '#ss-auth-loading span {',
    '  font-family: "Courier Prime", monospace; font-size: 12px;',
    '  letter-spacing: 3px; color: ' + accent + '; text-transform: uppercase;',
    '}',
    '',
    '/* Hide content by default until auth resolves */',
    '.ss-content-hidden { display: none !important; }'
  ].join('\n');
  document.head.appendChild(style);

  // ── ADD LOADING SCREEN ───────────────────────────────────
  var loading = document.createElement('div');
  loading.id = 'ss-auth-loading';
  loading.innerHTML = '<span>Verifying access...</span>';
  document.body.appendChild(loading);

  // Hide course content immediately
  var modules = qsa('.module, .features-section');
  for (var m = 0; m < modules.length; m++) {
    modules[m].classList.add('ss-content-hidden');
  }
  var lockedNotice = qs('.locked-notice');
  if (lockedNotice) lockedNotice.classList.add('ss-content-hidden');

  // ── STATE ────────────────────────────────────────────────
  var authInitialized = false;

  // ── SHOW LOGIN OVERLAY ───────────────────────────────────
  function showLogin() {
    removeLoading();
    document.body.appendChild(overlay);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('visible');
      });
    });

    var form = document.getElementById('ss-auth-form');
    var emailInput = document.getElementById('ss-auth-email');
    var submitBtn = document.getElementById('ss-auth-submit');
    var status = document.getElementById('ss-auth-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = emailInput.value.trim();
      if (!email) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'SENDING...';
      status.className = 'ss-auth-status info';
      status.textContent = 'Sending magic link...';

      sb.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: window.location.origin + window.location.pathname
        }
      }).then(function (result) {
        if (result.error) {
          status.className = 'ss-auth-status error';
          status.textContent = result.error.message;
          submitBtn.disabled = false;
          submitBtn.textContent = 'SEND MAGIC LINK';
        } else {
          status.className = 'ss-auth-status success';
          status.textContent = 'Magic link sent. Check your email and click the link to access your portal.';
          submitBtn.textContent = 'LINK SENT';
          emailInput.disabled = true;
        }
      });
    });
  }

  // ── SHOW CONTENT (AUTHORIZED) ────────────────────────────
  function showContent(session) {
    removeLoading();
    removeOverlay();
    for (var m = 0; m < modules.length; m++) {
      modules[m].classList.remove('ss-content-hidden');
    }
    // Replace old locked notice with authenticated user bar
    if (lockedNotice) {
      lockedNotice.innerHTML = [
        '<p style="font-family:\'Courier Prime\',monospace;font-size:12px;letter-spacing:1px;color:' + accent + ';">',
        '  &#10003; ACCESS GRANTED &mdash; ' + session.user.email,
        '</p>',
        '<button class="ss-signout" onclick="window.__ssSignOut()">SIGN OUT</button>'
      ].join('');
      lockedNotice.classList.remove('ss-content-hidden');
      lockedNotice.className = 'locked-notice';
    }
  }

  // ── SHOW NO ACCESS (WRONG TIER) ──────────────────────────
  function showNoAccess(session) {
    removeLoading();
    removeOverlay();
    if (lockedNotice) {
      lockedNotice.innerHTML = [
        '<h3>This tier is not included in your current access</h3>',
        '<p>You\'re signed in, but your purchase doesn\'t include this content. Upgrade to unlock this portal.</p>',
        '<a href="/" class="btn-access">VIEW PRODUCTS</a>',
        '<p class="ss-user-email">Signed in as: ' + session.user.email + '</p>',
        '<button class="ss-signout" onclick="window.__ssSignOut()">SIGN OUT</button>'
      ].join('');
      lockedNotice.classList.remove('ss-content-hidden');
      lockedNotice.className = 'locked-notice';
    }
  }

  // ── SIGN OUT ─────────────────────────────────────────────
  window.__ssSignOut = function () {
    sb.auth.signOut().then(function () {
      window.location.reload();
    });
  };

  // ── HELPERS ──────────────────────────────────────────────
  function removeLoading() {
    var el = document.getElementById('ss-auth-loading');
    if (el) el.remove();
  }

  function removeOverlay() {
    var el = document.getElementById('ss-auth-overlay');
    if (el) el.remove();
  }

  // ── CHECK ACCESS ─────────────────────────────────────────
  function checkAccessAndRender(session) {
    // Query all active tiers for this user by email
    sb.from('member_access')
      .select('tier_slug')
      .eq('email', session.user.email.toLowerCase())
      .eq('status', 'active')
      .then(function (result) {
        if (result.error || !result.data || result.data.length === 0) {
          showNoAccess(session);
          return;
        }
        var userTiers = result.data.map(function (r) { return r.tier_slug; });
        if (hasAccessToTier(userTiers, TIER_SLUG)) {
          showContent(session);
        } else {
          showNoAccess(session);
        }
      });
  }

  // ── MAIN INIT ────────────────────────────────────────────
  function init() {
    if (authInitialized) return;
    authInitialized = true;

    sb.auth.getSession().then(function (result) {
      var session = result.data.session;
      if (session) {
        checkAccessAndRender(session);
      } else {
        showLogin();
      }
    });
  }

  // Listen for magic link callback (URL hash fragment)
  sb.auth.onAuthStateChange(function (event, session) {
    if (event === 'SIGNED_IN' && session) {
      authInitialized = false;
      checkAccessAndRender(session);
    }
  });

  // Wait for DOM ready, then init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
