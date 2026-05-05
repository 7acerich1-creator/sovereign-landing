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
| ☐ | https://sovereign-synthesis.com/ | `index.html` | Main landing — Protocol Zero is now headline offer |
| ☐ | https://sovereign-synthesis.com/about | `about.html` | Purpose page |
| ☐ | https://sovereign-synthesis.com/protocol-zero | `protocol-zero/index.html` | **NEW** — The Entry. $0 free product. Email signup → enroll_protocol_zero RPC → magic link to Tier 0 portal. |
| ☐ | https://sovereign-synthesis.com/newsletter | `newsletter/index.html` | **NEW** — Newsletter archive index. Numbered editions. Subscribe form writes to newsletter_subscribers. |
| ☐ | https://sovereign-synthesis.com/newsletter/your-default-settings-are-a-lie | `newsletter/your-default-settings-are-a-lie/index.html` | **NEW** — Edition 01 (Anita's draft). |
| ☐ | https://sovereign-synthesis.com/diagnostic | `tier-1/diagnostic.html` | Interference Pattern Diagnostic — also the capstone of Tier 0 Protocol Zero |
| ☐ | https://sovereign-synthesis.com/manual | `manual/index.html` | **Reality Override Manual INTERACTIVE — 7 sections, NPC vs Architect diagnostic with personalized tally, vocabulary defined inline. PDF lives as companion.** |
| ☐ | https://sovereign-synthesis.com/manifesto-portal | `manifesto-portal/index.html` | **Manifesto INTERACTIVE — 11 sections, save-state, vocabulary defined inline** |
| ☐ | https://sovereign-synthesis.com/p77 | `p77/index.html` | Protocol 77 sales page |
| ☐ | https://sovereign-synthesis.com/download | `download.html` | Generic Manual download |
| ☐ | https://sovereign-synthesis.com/privacy | `privacy.html` | Privacy policy |
| ☐ | https://sovereign-synthesis.com/terms | `terms.html` | Terms of service |
| ☐ | https://sovereign-synthesis.com/unsubscribe | `unsubscribe.html` | Unsubscribe form |
| ☐ | https://sovereign-synthesis.com/login | `login.html` | **Universal login** — magic-link entry point, works on any device. Supports `?next=/path` for post-auth redirect. |
| ☐ | https://sovereign-synthesis.com/members | `members/index.html` | **Members dashboard** — lists every active tier the signed-in user has, plus smart "next rung" recommendation. Sign-out button. |

## 2. MEMBER PORTALS (auth-gated · uses `/js/auth-gate.js`)

**Free tier (auto-enroll on signup at $0):**

| ☐ | Live URL | Repo path | Tier slug | Price |
|---|----------|-----------|-----------|-------|
| ☐ | /tier-0/protocol-zero | `tier-0/protocol-zero/index.html` | `protocol_zero` | $0 |

**Paid tiers:**

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

## 7. COMPANION PDFS (light editorial brand)

Two complete. Two remaining.

| ☐ | Live URL | Repo path | Status |
|---|----------|-----------|--------|
| ☐ | /tier-1/assets/REALITY_OVERRIDE_MANUAL.pdf | `tier-1/assets/REALITY_OVERRIDE_MANUAL.pdf` | **REBUILT** — 9 pages, light editorial. Linked from /manual cover. |
| ☐ | /tier-3/assets/SOVEREIGN_ARCHITECTURE_MANIFESTO.pdf | `tier-3/assets/SOVEREIGN_ARCHITECTURE_MANIFESTO.pdf` | **NEW** — 16 pages. Linked from /manifesto-portal cover, /tier-3/manifesto-navigator, and tier-3 purchase email. |
| ☐ | /tier-2/assets/THE_SHIELD_MANUAL.pdf | `tier-2/assets/THE_SHIELD_MANUAL.pdf` | **REBUILT** — 19 pages, light editorial. Renamed from PROTOCOL_77_v4.pdf. Aligned with 4-phase runner architecture (Gray Rock / Faraday / Lighthouse / Anchor) — preserves the 3 underlying systems (Approval Reflex / Overload Spiral / Identity Lock) as diagnostic doctrine. 21-day deployment plan replaces old 77-day plan. Linked from runner briefing + deliverables. |
| ☐ | /tier-2/assets/GRAY_ROCK_FIELD_MANUAL.pdf | `tier-2/assets/GRAY_ROCK_FIELD_MANUAL.pdf` | **REBUILT + EXPANDED** — 19-page playbook (was 3-page one-pager). 12 scripted lines, 4 vector types, 5 trigger patterns, 7-day install, failure modes, field scenarios. Linked from runner Phase 1 + deliverables. Old gray-rock-override.pdf removed. |

## 8. WHAT'S STILL ON THE DOCKET

- **Protocol Zero** (architecture decision pending — placement + format)
- **Audit ad-targeted sales pages for T3-T7** if needed (currently sold via portal CTAs and email)

## 8. AUDIT NOTES (write here as you walk through)

> _Audit notes go here..._
