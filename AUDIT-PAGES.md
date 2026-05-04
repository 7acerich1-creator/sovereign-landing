# SOVEREIGN SYNTHESIS — FUNNEL REDESIGN AUDIT INDEX

> Single source of truth for auditing the full funnel reskin.
> Every redesigned surface is listed below with its **live URL** (after deploy), its **repo path**, and a **checkbox**.

**Session:** 2026-05-04 · Full funnel reskin + Manifesto interactive + auth gate fix
**Theme:** Light only · Editorial publication aesthetic · Reference: sovereign-synthesis.com homepage
**Canonical CSS:** `/css/sovereign.css` · **Auth JS:** `/js/auth-gate.js`

---

## 1. PUBLIC PAGES (no auth required)

| ☐ | Live URL | Repo path | What it is |
|---|----------|-----------|------------|
| ☐ | https://sovereign-synthesis.com/ | `index.html` | Main landing — refined |
| ☐ | https://sovereign-synthesis.com/about | `about.html` | Purpose page |
| ☐ | https://sovereign-synthesis.com/diagnostic | `tier-1/diagnostic.html` | Interference Pattern Diagnostic — full reskin |
| ☐ | https://sovereign-synthesis.com/manual | `manual/index.html` | Reality Override Manual portal |
| ☐ | https://sovereign-synthesis.com/manifesto-portal | `manifesto-portal/index.html` | **Manifesto INTERACTIVE — 11 sections, save-state, vocabulary defined inline** |
| ☐ | https://sovereign-synthesis.com/p77 | `p77/index.html` | Protocol 77 sales page |
| ☐ | https://sovereign-synthesis.com/download | `download.html` | Generic Manual download |
| ☐ | https://sovereign-synthesis.com/privacy | `privacy.html` | Privacy policy |
| ☐ | https://sovereign-synthesis.com/terms | `terms.html` | Terms of service |
| ☐ | https://sovereign-synthesis.com/unsubscribe | `unsubscribe.html` | Unsubscribe form |

## 2. PAID MEMBER PORTALS (auth-gated · uses `/js/auth-gate.js`)

The auth overlay is now light editorial — every paid customer gets the on-brand "Access your portal" card.

| ☐ | Live URL | Repo path | Tier slug | Price |
|---|----------|-----------|-----------|-------|
| ☐ | /tier-2/protocol-77-runner | `tier-2/protocol-77-runner.html` | `p77` | $77 |
| ☐ | /tier-3/manifesto-navigator | `tier-3/manifesto-navigator.html` | `manifesto` | $177 |
| ☐ | /tier-4/course-portal | `tier-4/course-portal.html` | `dp1` | $477 |
| ☐ | /tier-5/course-portal | `tier-5/course-portal.html` | `dp2` | $1,497 |
| ☐ | /tier-6/course-portal | `tier-6/course-portal.html` | `dp3` | $3,777 |
| ☐ | /tier-7/member-portal | `tier-7/member-portal.html` | `inner_circle` | $12,000 |

P77 Runner has the phase/day swap bug fixed (Lighthouse=Day 5, Anchor=Day 7) and lexical bridging on "interference vector".

## 3. POST-PURCHASE THANK-YOU PAGES (Stripe success_url targets)

All six reskinned to light editorial confirmation pattern. Auto-redirect to the corresponding portal after 6 seconds.

| ☐ | Live URL | Repo path |
|---|----------|-----------|
| ☐ | /tier-2/thank-you | `tier-2/thank-you.html` |
| ☐ | /tier-3/thank-you | `tier-3/thank-you.html` |
| ☐ | /tier-4/thank-you | `tier-4/thank-you.html` |
| ☐ | /tier-5/thank-you | `tier-5/thank-you.html` |
| ☐ | /tier-6/thank-you | `tier-6/thank-you.html` |
| ☐ | /tier-7/thank-you | `tier-7/thank-you.html` |

## 4. EMAIL TEMPLATES

Audit by double-clicking each `.html` file in File Explorer — Chrome renders it like an inbox.

| ☐ | Repo path | When it sends |
|---|-----------|---------------|
| ☐ | `email-templates/01-welcome-email.html` | Step 1 (immediate) — also live in `nurture_templates` DB |
| ☐ | `email-templates/nurture-02-p77-pitch.html` | Step 2 (Day 3) — live in DB |
| ☐ | `email-templates/nurture-03-manifesto.html` | Step 3 (Day 7) — live in DB |
| ☐ | `email-templates/nurture-04-portal.html` | Step 4 (Day 10) — live in DB |
| ☐ | `email-templates/nurture-05-inner-circle.html` | Step 5 (Day 14) — live in DB |
| ☐ | `email-templates/02-purchase-tier2-p77.html` | On webhook (7700) — live in `send-purchase-email` Edge Fn |
| ☐ | `email-templates/03-purchase-tier3-manifesto.html` | On webhook (17700) |
| ☐ | `email-templates/04-purchase-tier4-phase1.html` | On webhook (47700) |
| ☐ | `email-templates/05-purchase-tier5-phase2.html` | On webhook (149700) |
| ☐ | `email-templates/06-purchase-tier6-phase3.html` | On webhook (377700) |
| ☐ | `email-templates/07-purchase-tier7-innercircle.html` | On webhook (1200000) |
| ☐ | `email-templates/magic-link-template.html` | Supabase auth magic link |

## 5. LEGACY FILES TO DELETE (final cleanup pass)

Two leftover legacy files. Run the PowerShell command at the bottom of this file to delete them.

| Repo path | Replaced by |
|-----------|-------------|
| `tier-1/index.html` | `/manual` (canonical Manual landing) |
| `tier-1/download.html` | `/download` (canonical download page) |

(Previous round of deletes already cleared: `tier-2/protocol-77.html`, `tier-3/manifesto.html`, `tier-4/defense-protocol.html`, `tier-5/phase-2.html`, `tier-6/phase-3.html`, `tier-7/inner-circle.html`, `tier-0/links.html`, `p77/diagnostic/index.html`.)

## 6. DEPLOY CHECKLIST

```
cd C:\Users\richi\Sovereign-Mission-Control\sovereign-landing
git add .
git commit -m "Manifesto interactive + auth gate light + thank-you pages reskinned + final legacy cleanup"
git push origin main
```

Vercel auto-deploys 60-90 seconds after push.

## 7. WHAT'S STILL ON THE DOCKET (NOT THIS SESSION)

- Reality Override Manual interactive (replaces the PDF download with a paced web experience like the Manifesto)
- Protocol Zero (architecture decision pending — placement + format)
- Optional: redesigned PDFs in editorial light brand (Manual, Manifesto, P77 docs, Gray Rock one-pager) as fallback / brand-consistent companions to the interactives
- Audit ad-targeted sales pages for T3-T7 if needed (currently sold via portal CTAs and email)

## 8. AUDIT NOTES (write here as you walk through)

> _Audit notes go here..._
