// ============================================================
// SOVEREIGN SYNTHESIS — AUTH GATE
// Magic-link auth + tier access control on portal pages.
// Uses canonical light editorial design (matches sovereign.css).
// Requires: supabase-js v2 loaded via CDN before this script
// Config:  window.SS_TIER_SLUG must be set before this script
// ============================================================

(function () {
  'use strict';

  var SUPABASE_URL = 'https://wzthxohtgojenukmdubz.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6dGh4b2h0Z29qZW51a21kdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzY1ODcsImV4cCI6MjA4OTQ1MjU4N30.YaUrxPCBKGWscbebkdekDvRMGb_eFD0yRTVaM8C2frU';

  var TIER_SLUG = window.SS_TIER_SLUG;
  if (!TIER_SLUG) return;

  // Tier hierarchy
  // Inner Circle ($12K) gets everything
  // Architect tiers cumulative: dp3 ⊃ dp2 ⊃ dp1
  // P77 and Manifesto are standalone
  var TIER_NUMBERS = { p77: 2, manifesto: 3, dp1: 4, dp2: 5, dp3: 6, inner_circle: 7 };

  function hasAccessToTier(userTiers, requiredTier) {
    if (userTiers.indexOf('inner_circle') !== -1) return true;
    if (userTiers.indexOf(requiredTier) !== -1) return true;
    if (requiredTier === 'dp1' || requiredTier === 'dp2' || requiredTier === 'dp3') {
      var reqNum = TIER_NUMBERS[requiredTier];
      for (var i = 0; i < userTiers.length; i++) {
        var t = userTiers[i];
        if ((t === 'dp1' || t === 'dp2' || t === 'dp3') && TIER_NUMBERS[t] >= reqNum) return true;
      }
    }
    return false;
  }

  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return document.querySelectorAll(sel); }

  // ── BUILD AUTH OVERLAY ───────────────────────────────────
  var overlay = document.createElement('div');
  overlay.id = 'ss-auth-overlay';
  overlay.innerHTML = [
    '<div class="ss-auth-card">',
    '  <div class="ss-auth-badge">SOVEREIGN SYNTHESIS</div>',
    '  <h2 class="ss-auth-title">Access your portal.</h2>',
    '  <p class="ss-auth-desc">Enter the email you used to purchase. We\'ll send you a magic link to unlock your content.</p>',
    '  <form id="ss-auth-form">',
    '    <input type="email" id="ss-auth-email" placeholder="your@email.com" required autocomplete="email" />',
    '    <button type="submit" id="ss-auth-submit">Send Magic Link &rarr;</button>',
    '  </form>',
    '  <div id="ss-auth-status" class="ss-auth-status"></div>',
    '  <div class="ss-auth-footer">',
    '    <p>Don\'t have access? <a href="/" class="ss-auth-link">View products</a></p>',
    '  </div>',
    '</div>'
  ].join('\n');

  // ── STYLES — LIGHT EDITORIAL (matches sovereign.css canonical) ──
  var style = document.createElement('style');
  style.textContent = [
    '#ss-auth-overlay {',
    '  position: fixed; top: 0; left: 0; width: 100%; height: 100%;',
    '  background: rgba(245,244,240,0.96); backdrop-filter: blur(10px);',
    '  display: flex; align-items: center; justify-content: center;',
    '  z-index: 10000; opacity: 0; transition: opacity 0.4s ease;',
    '  padding: 24px;',
    '  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
    '}',
    '#ss-auth-overlay.visible { opacity: 1; }',
    '.ss-auth-card {',
    '  max-width: 460px; width: 100%; padding: 48px 40px; text-align: center;',
    '  background: #ffffff; border: 1px solid #ddd8d0; border-radius: 8px;',
    '  position: relative; overflow: hidden;',
    '  box-shadow: 0 4px 32px rgba(26,26,46,0.06);',
    '}',
    '.ss-auth-card::before {',
    '  content: ""; position: absolute; top: 0; left: 0; right: 0;',
    '  height: 3px; background: #d4a843;',
    '}',
    '.ss-auth-badge {',
    '  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
    '  font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;',
    '  color: #E5850F; margin-bottom: 28px; display: inline-block;',
    '}',
    '.ss-auth-title {',
    '  font-family: Georgia, "Times New Roman", serif;',
    '  font-size: 26px; font-weight: 600; color: #1a1a2e;',
    '  margin-bottom: 14px; line-height: 1.3; letter-spacing: -0.3px;',
    '}',
    '.ss-auth-desc {',
    '  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
    '  font-size: 15px; color: #555555; line-height: 1.65;',
    '  margin-bottom: 28px;',
    '}',
    '#ss-auth-form { display: flex; flex-direction: column; gap: 12px; }',
    '#ss-auth-email {',
    '  width: 100%; padding: 14px 16px; font-size: 16px;',
    '  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
    '  background: #ffffff; color: #1a1a2e;',
    '  border: 1px solid #ddd8d0; border-radius: 4px;',
    '  outline: none; transition: border-color 0.2s;',
    '}',
    '#ss-auth-email:focus { border-color: #d4a843; }',
    '#ss-auth-email::placeholder { color: #b0aca5; }',
    '#ss-auth-submit {',
    '  padding: 16px 36px;',
    '  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
    '  font-size: 13px; font-weight: 700; letter-spacing: 1.5px;',
    '  text-transform: uppercase; cursor: pointer;',
    '  background: #d4a843; color: #1a1a2e;',
    '  border: 1.5px solid #d4a843; border-radius: 4px;',
    '  transition: all 0.15s ease;',
    '}',
    '#ss-auth-submit:hover { background: #b8902f; border-color: #b8902f; color: #fff; }',
    '#ss-auth-submit:disabled { opacity: 0.55; cursor: not-allowed; }',
    '.ss-auth-status {',
    '  margin-top: 18px;',
    '  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
    '  font-size: 13px; line-height: 1.55; min-height: 20px;',
    '}',
    '.ss-auth-status.success { color: #1D9E75; }',
    '.ss-auth-status.error { color: #D95555; }',
    '.ss-auth-status.info { color: #555555; }',
    '.ss-auth-footer {',
    '  margin-top: 28px; padding-top: 20px; border-top: 1px solid #ddd8d0;',
    '}',
    '.ss-auth-footer p {',
    '  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
    '  font-size: 13px; color: #8E8C9A;',
    '}',
    '.ss-auth-link { color: #E5850F; text-decoration: none; font-weight: 600; }',
    '.ss-auth-link:hover { text-decoration: underline; }',
    '',
    '/* No-access state (rendered into .locked-notice) */',
    '.ss-no-access {',
    '  background: #ffffff; border: 1px solid #ddd8d0; border-radius: 8px;',
    '  padding: 40px; text-align: center; margin: 48px auto; max-width: 540px;',
    '  position: relative; overflow: hidden;',
    '}',
    '.ss-no-access::before {',
    '  content: ""; position: absolute; top: 0; left: 0; right: 0;',
    '  height: 3px; background: #d4a843;',
    '}',
    '.ss-no-access h3 {',
    '  font-family: Georgia, "Times New Roman", serif;',
    '  font-size: 22px; color: #1a1a2e; margin-bottom: 12px; font-weight: 600;',
    '}',
    '.ss-no-access p {',
    '  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
    '  color: #555555; margin-bottom: 20px; font-size: 15px; line-height: 1.65;',
    '}',
    '.ss-no-access .btn-access {',
    '  display: inline-block; padding: 14px 32px;',
    '  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
    '  font-size: 13px; font-weight: 700; letter-spacing: 1.5px;',
    '  text-transform: uppercase; text-decoration: none;',
    '  background: #d4a843; color: #1a1a2e;',
    '  border: 1.5px solid #d4a843; border-radius: 4px;',
    '  transition: all 0.15s ease;',
    '}',
    '.ss-no-access .btn-access:hover { background: #b8902f; border-color: #b8902f; color: #fff; }',
    '.ss-no-access .ss-user-email {',
    '  font-family: "Courier New", monospace; font-size: 12px;',
    '  color: #8E8C9A; margin-top: 18px; letter-spacing: 0.5px;',
    '}',
    '.ss-no-access .ss-signout {',
    '  display: inline-block; margin-top: 14px;',
    '  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
    '  font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;',
    '  color: #555555; cursor: pointer;',
    '  background: transparent; border: 1.5px solid #ddd8d0;',
    '  padding: 10px 20px; border-radius: 4px;',
    '  transition: all 0.15s ease;',
    '}',
    '.ss-no-access .ss-signout:hover { border-color: #1a1a2e; color: #1a1a2e; }',
    '',
    '/* Loading state */',
    '#ss-auth-loading {',
    '  position: fixed; top: 0; left: 0; width: 100%; height: 100%;',
    '  background: #f5f4f0; display: flex;',
    '  align-items: center; justify-content: center; z-index: 9999;',
    '}',
    '#ss-auth-loading span {',
    '  font-family: "Courier New", monospace; font-size: 11px;',
    '  letter-spacing: 3px; color: #8E8C9A; text-transform: uppercase;',
    '}',
    '',
    '/* Granted-access user bar (rendered into .locked-notice when authorized) */',
    '.locked-notice .ss-granted {',
    '  background: #faf9f5; border: 1px solid #ddd8d0; border-radius: 8px;',
    '  padding: 14px 20px; margin: 24px auto; max-width: 540px;',
    '  display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;',
    '}',
    '.locked-notice .ss-granted-text {',
    '  font-family: "Courier New", monospace; font-size: 11px;',
    '  letter-spacing: 1.5px; color: #1D9E75; text-transform: uppercase;',
    '}',
    '.locked-notice .ss-signout {',
    '  display: inline-block;',
    '  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
    '  font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;',
    '  color: #8E8C9A; cursor: pointer;',
    '  background: transparent; border: 1px solid #ddd8d0;',
    '  padding: 6px 14px; border-radius: 4px;',
    '  transition: all 0.15s ease;',
    '}',
    '.locked-notice .ss-signout:hover { border-color: #1a1a2e; color: #1a1a2e; }',
    '',
    '.ss-content-hidden { display: none !important; }',
    '',
    '@media (max-width: 480px) {',
    '  .ss-auth-card { padding: 36px 24px; }',
    '  .ss-auth-title { font-size: 22px; }',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  // Loading overlay
  var loading = document.createElement('div');
  loading.id = 'ss-auth-loading';
  loading.innerHTML = '<span>Verifying access...</span>';
  document.body.appendChild(loading);

  // Hide course content until auth resolves
  var modules = qsa('.module, .features-section, section.block, .phase-wrap');
  for (var m = 0; m < modules.length; m++) {
    modules[m].classList.add('ss-content-hidden');
  }
  var lockedNotice = qs('.locked-notice');
  if (lockedNotice) lockedNotice.classList.add('ss-content-hidden');

  var authInitialized = false;

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
      submitBtn.textContent = 'Sending...';
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
          submitBtn.textContent = 'Send Magic Link →';
        } else {
          status.className = 'ss-auth-status success';
          status.textContent = 'Magic link sent. Check your email and click the link to access your portal.';
          submitBtn.textContent = 'Link Sent ✓';
          emailInput.disabled = true;
        }
      });
    });
  }

  function showContent(session) {
    removeLoading();
    removeOverlay();
    for (var m = 0; m < modules.length; m++) {
      modules[m].classList.remove('ss-content-hidden');
    }
    if (lockedNotice) {
      lockedNotice.innerHTML = [
        '<div class="ss-granted">',
        '  <span class="ss-granted-text">✓ Access granted &mdash; ' + session.user.email + '</span>',
        '  <button class="ss-signout" onclick="window.__ssSignOut()">Sign out</button>',
        '</div>'
      ].join('');
      lockedNotice.classList.remove('ss-content-hidden');
      lockedNotice.className = 'locked-notice';
    }
  }

  function showNoAccess(session) {
    removeLoading();
    removeOverlay();
    if (lockedNotice) {
      lockedNotice.innerHTML = [
        '<div class="ss-no-access">',
        '  <h3>This tier is not in your current access.</h3>',
        '  <p>You\'re signed in, but your purchase doesn\'t include this content. Upgrade to unlock this portal.</p>',
        '  <a href="/" class="btn-access">View products &rarr;</a>',
        '  <p class="ss-user-email">Signed in as: ' + session.user.email + '</p>',
        '  <button class="ss-signout" onclick="window.__ssSignOut()">Sign out</button>',
        '</div>'
      ].join('');
      lockedNotice.classList.remove('ss-content-hidden');
      lockedNotice.className = 'locked-notice';
    }
  }

  window.__ssSignOut = function () {
    sb.auth.signOut().then(function () {
      window.location.reload();
    });
  };

  function removeLoading() {
    var el = document.getElementById('ss-auth-loading');
    if (el) el.remove();
  }
  function removeOverlay() {
    var el = document.getElementById('ss-auth-overlay');
    if (el) el.remove();
  }

  function checkAccessAndRender(session) {
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

  sb.auth.onAuthStateChange(function (event, session) {
    if (event === 'SIGNED_IN' && session) {
      authInitialized = false;
      checkAccessAndRender(session);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
