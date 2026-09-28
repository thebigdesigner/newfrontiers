# Deploying — newfrontiersglobal.online

Static site. No build step, no dependencies, no framework.

## Files

```
index.html            home (one page — About / Network / Events / Resources are anchors)
onboarding.html       six-section application form (markup unchanged from the original)
404.html              not-found page (Vercel serves this automatically)
vercel.json           redirects, caching, security headers, chat function config
robots.txt / sitemap.xml
assets/css/site.css   the D-Vine design system (unchanged)
assets/css/pages.css  D-Vine inner-page styles (unchanged)
assets/css/nf.css     New Frontiers additions: logo, globe panel, portrait, form theme
assets/js/site.js     D-Vine nav, reveals, counters, hero camera (unchanged)
assets/js/globe.js    interactive 3D globe (uses three.js r128 from cdnjs)
assets/js/form.js     form logic + Google Apps Script endpoint (unchanged)
assets/js/chat.js     website assistant widget (WhatsApp hand-off)
api/chat.js           assistant server function (Google Gemini)
content/network.json  what the assistant knows — edit this to update its answers
images/               photos, logo, event artwork, convener cut-out
```

## 1. Push to Git

Commit the whole folder to a GitHub / GitLab / Bitbucket repo. Everything above
belongs in the repo — there is nothing to gitignore.

## 2. Import into Vercel

New Project → import the repo, then:

| Setting | Value |
|---|---|
| Framework Preset | **Other** |
| Root Directory | `./` |
| Build Command | *leave empty* |
| Output Directory | *leave empty* (serves the repo root) |
| Install Command | *leave empty* |

Deploy. You get a `*.vercel.app` URL — **check the whole site on that URL before
touching DNS**, including submitting one test application.

## 3. Attach the domain — order matters

WordPress is currently serving this domain. To avoid downtime:

1. In Vercel: Project → Settings → Domains → add `newfrontiersglobal.online`
   **and** `www.newfrontiersglobal.online`.
2. Vercel shows the exact DNS records to create. Use the values it displays —
   don't copy them from anywhere else, they differ by setup.
3. At the registrar, lower the TTL on the existing records to 300s and wait for
   the old TTL to expire. This shortens the switch-over window.
4. Replace the records with Vercel's. Vercel issues the TLS certificate
   automatically once they resolve.
5. Only after the site is confirmed live on the real domain, decommission
   WordPress.

## 4. After DNS moves — verify

- [ ] `https://newfrontiersglobal.online/` loads over HTTPS, no certificate warning
- [ ] `https://newfrontiersglobal.online/onboardingform/` 301s to `/onboarding.html`
      (the old WordPress URL is indexed — this redirect protects existing links)
- [ ] **Submit a real test application and confirm the row lands in the Google Sheet.**
      The form posts with `mode:"no-cors"`, so the browser cannot read the response —
      a rejected POST still shows the success screen. This check is not optional.
- [ ] Apps Script deployment access is set to "Anyone", or posts from the new
      origin will be silently dropped
- [ ] Submit `sitemap.xml` in Google Search Console

## Notes

- `cleanUrls` is **false** on purpose, so `onboarding.html` works when opened
  straight off disk as well as on the host. Turning it on means rewriting every
  internal link to extensionless paths.
- `/images/` and `/assets/` are cached for a year as immutable. If you replace a
  photo or edit the CSS, **rename the file** or visitors keep the old one.
- Editing the header or footer means editing all three HTML files — the markup is
  deliberately identical in each. Styling and behaviour are single-source in
  `assets/css/site.css` and `assets/js/site.js`.

## Still outstanding

- Footer social links are `#` placeholders
- No favicon
- "Watch the vision film" points at the About section, not a video
- The Quarterly Summit artwork has "Quaterly" misspelled inside the image itself


## Website assistant (chat)

The chat bubble works in two modes:

- **Without a key** it acts as a WhatsApp shortcut to +234 802 829 5917.
- **With a key** it answers questions about the network and hands off to
  WhatsApp with a summary of the conversation.

To switch on the AI answers, add a Google Gemini API key in Vercel:
Project → Settings → Environment Variables → `GEMINI_API_KEY` (Production),
then redeploy. Or from a terminal:

```
vercel env add GEMINI_API_KEY production
vercel --prod
```

To change what it knows (events, dates, fees, new resources), edit
`content/network.json` and redeploy. It is told never to invent dates, fees or
venues that aren't in that file.
