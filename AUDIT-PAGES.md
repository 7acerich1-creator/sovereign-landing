# SOVEREIGN SYNTHESIS — FUNNEL REDESIGN AUDIT INDEX

> Single source of truth for auditing the full funnel reskin.
> Every redesigned surface is listed below with its **live URL** (after deploy), its **repo path** (where the file lives), and a **checkbox** so you can mark it audited.

**Session:** 2026-05-04 · Full funnel end-to-end reskin
**Theme:** Light only · Editorial / publication aesthetic · Reference: existing sovereign-synthesis.com homepage
**Canonical CSS:** `/css/sovereign.css` (single source of truth — every page links to this)

---

## 1. PUBLIC PAGES (no auth required)

Audit each. Look for: layout, readability, copy alignment, link integrity, mobile responsiveness.

| ☐ | Live URL | Repo path | What it is |
|---|----------|-----------|------------|
| ☐ | https://sovereign-synthesis.com/ | `index.html` | Main landing — refined to use `css/sovereign.css` |
| ☐ | https://sovereign-synthesis.com/about | `about.html` | Purpose page — full reskin |
| ☐ | https://sovereign-synthesis.com/diagnostic | `tier-1/diagnostic.html` | Interference Pattern Diagnostic — full reskin (was the cyan terminal) |
| ☐ | https://sovereign-synthesis.com/manual | `manual/index.html` | Reality Override Manual portal — full reskin |
| ☐ | https://sovereign-synthesis.com/manifesto-portal | `manifesto-portal/index.html` | Free Manifesto download — full reskin |
| ☐ | https://sovereign-synthesis.com/p77 | `p77/index.html` | Protocol 77 sales page — full reskin |
| ☐ | https://sovereign-synthesis.com/download | `download.html` | Generic Manual download — full reskin |
| ☐ | https://sovereign-synthesis.com/privacy | `privacy.html` | Privacy policy — full reskin + plain-language rewrite |
| ☐ | https://sovereign-synthesis.com/terms | `terms.html` | Terms of service — full reskin + plain-language rewrite |
| ☐ | https://sovereign-synthesis.com/unsubscribe | `unsubscribe.html` | Unsubscribe form (Supabase RPC) — full reskin |

---

## 2. PAID MEMBER PORTALS (auth-gated)

Each requires Supabase magic-link auth. Test by purchasing or by granting yourself `member_access` for the slug.

| ☐ | Live URL | Repo path | Tier slug | Purchase price |
|---|----------|-----------|-----------|----------------|
| ☐ | https://sovereign-synthesis.com/tier-2/protocol-77-runner | `tier-2/protocol-77-runner.html` | `p77` | $77 |
| ☐ | https://sovereign-synthesis.com/tier-3/manifesto-navigator | `tier-3/manifesto-navigator.html` | `manifesto` | $177 |
| ☐ | https://sovereign-synthesis.com/tier-4/course-portal | `tier-4/course-portal.html` | `dp1` | $477 |
| ☐ | https://sovereign-synthesis.com/tier-5/course-portal | `tier-5/course-portal.html` | `dp2` | $1,497 |
| ☐ | https://sovereign-synthesis.com/tier-6/course-portal | `tier-6/course-portal.html` | `dp3` | $3,777 |
| ☐ | https://sovereign-synthesis.com/tier-7/member-portal | `tier-7/member-portal.html` | `inner_circle` | $12,000 |

**Bug fixed in Protocol 77 Runner:** phase/day swap corrected per master reference. Lighthouse is now Phase 3 / Day 5. Sovereign Anchor is Phase 4 / Day 7. Lexical bridging on "interference vector" added before first prompt.

---

## 3. EMAIL TEMPLATES

These render inside Gmail / Apple Mail / Outlook. Light editorial. To audit, open each `.html` file directly in a browser, or send a test through Resend.

| ☐ | Repo path | What it is | When it sends |
|---|-----------|------------|---------------|
| ☐ | `email-templates/01-welcome-email.html` | Welcome / Manual delivery | Step 1 (immediate on capture) |
| ☐ | `email-templates/nurture-02-p77-pitch.html` | "You ran the diagnostic. Here's what it means." | Step 2 (Day 3) |
| ☐ | `email-templates/nurture-03-manifesto.html` | "The map is yours. No charge." | Step 3 (Day 7) |
| ☐ | `email-templates/nurture-04-portal.html` | "The environment is ready." | Step 4 (Day 10) |
| ☐ | `email-templates/nurture-05-inner-circle.html` | "The last email in this sequence." | Step 5 (Day 14) |
| ☐ | `email-templates/02-purchase-tier2-p77.html` | P77 access confirmation | On Stripe webhook (amount 7700) |
| ☐ | `email-templates/03-purchase-tier3-manifesto.html` | Manifesto Navigator confirmation | On webhook (17700) |
| ☐ | `email-templates/04-purchase-tier4-phase1.html` | Phase 1 confirmation | On webhook (47700) |
| ☐ | `email-templates/05-purchase-tier5-phase2.html` | Phase 2 confirmation | On webhook (149700) |
| ☐ | `email-templates/06-purchase-tier6-phase3.html` | Phase 3 confirmation | On webhook (377700) |
| ☐ | `email-templates/07-purchase-tier7-innercircle.html` | Inner Circle welcome | On webhook (1200000) |
| ☐ | `email-templates/magic-link-template.html` | Supabase magic-link auth | On portal access request |

> **Important:** these HTML files are the source of truth. The `nurture_templates` Supabase table holds the runtime copies. After audit, push the email HTML changes into `nurture_templates` (rows for steps 1-5) so the actual sends pick them up. Edge Functions `send-purchase-email` and `stripe-webhook` will need to be updated separately if the inline HTML they emit doesn't match these files.

---

## 4. LEGACY FILES TO DELETE

I couldn't delete these directly (Cowork mode doesn't have file-delete permission). **Open File Explorer, navigate to the path, and delete each one.**

These are confirmed duplicates of the canonical pages above and are not linked from any redesigned surface.

| Repo path | Replaced by |
|-----------|-------------|
| `tier-2/protocol-77.html` | `/p77` (sales) + `/tier-2/protocol-77-runner` (paid) |
| `tier-3/manifesto.html` | `/tier-3/manifesto-navigator` |
| `tier-4/defense-protocol.html` | `/tier-4/course-portal` |
| `tier-5/phase-2.html` | `/tier-5/course-portal` |
| `tier-6/phase-3.html` | `/tier-6/course-portal` |
| `tier-7/inner-circle.html` | `/tier-7/member-portal` |
| `tier-0/links.html` | already redirected to `/` in `vercel.json` |
| `p77/diagnostic/index.html` | `/diagnostic` (which rewrites to `tier-1/diagnostic`) |

**Files to review before deleting (uncertain status — may have business logic or be Stripe redirect targets):**

| Repo path | Notes |
|-----------|-------|
| `tier-1/index.html` | Unknown — open and check if anything links to `/tier-1/` |
| `tier-1/download.html` | Possibly post-diagnostic Manual download — verify before deleting |
| `tier-2/thank-you.html` through `tier-7/thank-you.html` | Possibly Stripe success-redirect targets — check Stripe dashboard before deleting |

---

## 5. WHAT CHANGED (TECHNICAL)

- **New shared file:** `css/sovereign.css` — every redesigned page links to this. Single canonical token set, single component library. Any future page just needs `<link rel="stylesheet" href="/css/sovereign.css">` and the standard markup.
- **No more theme toggle.** Light theme is the only theme. The old `[data-theme="light"]` overrides and `.ss-theme-toggle` button have been removed everywhere.
- **No more Space Grotesk + Space Mono Google Fonts loads** on most pages. The system uses Georgia (display serif) + Helvetica Neue stack (body sans) + Courier (mono accent). All system-installed fonts — zero font-loading weight.
- **Email templates:** light default (`#f5f4f0` body bg) instead of dark default. Same table-based structure, gold accent line, transmission counter pattern.
- **Tier portals:** unified gold/copper/navy on cream. No more per-tier accent colors (was teal/violet/copper/gold). Differentiation is by content density, not visual style.
- **P77 Runner bug fix:** phase/day mapping corrected (Lighthouse=Day 5, Anchor=Day 7), lexical bridging on "interference vector" added.

---

## 6. AFTER AUDIT — DEPLOY CHECKLIST

Cowork can't push to git. Deploy is your move:

```
cd C:\Users\richi\Sovereign-Mission-Control\sovereign-landing
git status                          # see all changed files
git add .
git commit -m "Full funnel reskin — canonical light editorial system. Single CSS source of truth. P77 phase/day bug fix. Email templates flipped to light default."
git push origin main
```

Vercel auto-deploys on push. Check `https://sovereign-synthesis.com/` 60-90 seconds after push to confirm live.

**After deploy, re-walk this list with the live URLs.** That's the real audit.

---

## 7. REMAINING WORK NOT TOUCHED THIS SESSION

These are intentionally out of scope:

- Edge Function `send-purchase-email` HTML — that function has its own embedded HTML for the confirmation emails. The files in `email-templates/` are the source of truth for the brand standard, but the actual function code in Supabase needs to be updated separately to match.
- `nurture_templates` Supabase table — the HTML in `email-templates/01-welcome-email.html` through `nurture-05-inner-circle.html` needs to be pushed into the `nurture_templates` table rows (steps 1-5) so the live nurture poller picks them up.
- Tier portal *content* — the curriculum (modules, lessons, videos, interactive widgets) for Tiers 3-7 still needs to be authored. The portal pages are now branded shells with placeholder structure that says "deploying in waves" — that's the truth of the current state per master reference INFRA-09.

---

## 8. AUDIT NOTES SECTION (write here as you walk through)

Use this section to log what you found. Pattern: `Page → issue → fix needed`.

> _Audit notes go here..._

