# Mena Bakery & Carry Out site

New site for Mena Bakery & Carry Out (Ethiopian bakery, carry-out and market), 6222 Rolling Rd, Springfield, VA 22152.
They have no website today (Google shows "Add website"). Yelp lists them as Unclaimed.
Brief: minimalist site built off the Honeybear Bake Shop template (Squarespace), in a non-pink palette, with hero images
from Higgsfield, the full menu, hours and location, and a reviews section built the same way as the Kanji site
(`hens18/kanji`, `site/assets/reviews.js` + `reviews.css`).

## Standing rule: live link after every change

After EVERY commit (and push), publish the current site as the live preview and give the user the link:

1. `node scripts/build-preview.js --artifact` (bundles `site/` into `.preview/live.html`)
2. Publish `.preview/live.html` with the Artifact tool. Reuse the same URL every time: pass `url` = the live link
   below so it updates in place instead of creating a new one.
3. End the reply with the live link.

Live preview link: https://claude.ai/artifact/JgfdcbFB7WqbwA3aagxnfr (private until shared from its Share menu)

## Business facts (sources)

- Phone (703) 913-7133. In the West Springfield Shopping Center, between Bauer Dr and Traford Ln (Yahoo Local).
- Hours (Google, matches Yelp): Mon-Sat 9 AM - 9 PM, Sun 9 AM - 8 PM. Source of truth: `HOURS` in `site/assets/main.js`
  (also repeated in the JSON-LD block in `site/index.html`; update both).
- Yelp: 3.8 stars, 15 reviews, $$, categories Bakeries + Ethiopian. https://www.yelp.com/biz/mena-bakery-and-carry-out-springfield
- Menu: https://www.yelp.com/menu/mena-bakery-and-carry-out-springfield (curl works on /menu pages; /biz pages return 403).
  The site carries all of it: Breakfast, Lunch/Dinner, Vegetarian, Beverages, and Groceries (the Mena-brand injera and
  ambasha are in the "From our bakery" section).
- Online ordering: Grubhub https://www.grubhub.com/restaurant/mena-bakery--carry-out-6222-rolling-rd-springfield/2443743
  (same listing on Seamless; Uber Eats and Postmates also list them).

## NEEDS OWNER CONFIRMATION

- Menu cleanup done on the Yelp text: typos fixed (Collared -> Collard, Ambash -> Ambasha, medium rear -> medium rare,
  Yestom -> Yetsom, Miser -> Misir), "chile/chili" unified. The second "Beef Kaey (Yebere Alecha wot)" was renamed
  "Beef Alecha (Yebere Alecha Wot)" because its turmeric description is alecha, not key wot.
- Two items had no description on Yelp; we wrote neutral ones: Lamb Kaey "Lamb in a spicy red stew.", Sambusa
  "Crisp triangle pastry." (filling unknown). Pepsi's delivery-app blurb was dropped.
- "Our own injera and ambasha" is inferred from the Mena-brand bread on their grocery list.
- In business since 2002 per Mindtrip / YellowPages ("22 years"). Not on the site until confirmed.

## Reviews

- The client screenshots had the rating but no review text, and Yelp blocks automated reads. The four on the site are
  real Yelp reviews read through Yahoo Local's Yelp feed, which only shows each review's opening, so bodies are quoted
  verbatim up to the last complete sentence shown. Stars and dates as posted: Eliana M. 5 (2022-09-02),
  Bethel W. 5 (2022-06-30), Kay M. 4 (2017-07-29), Jamie C. 3 (2017-09-29). Left out: Daniela T. 1 star (2023).
- Never invent or edit review text. To swap in reviews the owner prefers, replace the `REVIEWS` array in
  `site/assets/reviews.js`. Keep at least 4: with fewer, the belt barely moves on a 1440px screen.

## Design direction (current)

- Honeybear layout, recolored: honey band (`--band #f4da9c`) where Honeybear used pink, deep leafy green
  (`--green #2c5a41`) for type and buttons, warm white page, wheat panels, sage and amber blobs.
- Hero: wave-edged honey band under the nav and headline, tilted carry-out box on the left bleeding off the edge,
  "We're *Mena* Bakery." with the name in script, split button "See the menu | ->", a script review quote next to a
  slowly turning seal, a sambusa in the bottom-right corner (Honeybear's cookie). On phones the band becomes the
  headline block's backdrop with a wave foot, the box straddles it, and the seal turns into a sticker on the box.
- Signature: the ambasha wheel mark (logo, favicon, seal), and the band's wave echoed on top of the footer.
- Type: Bricolage Grotesque (display), Figtree (body), Yellowtail (the one script word, logo, hero quote).
- Copy rules (from the 10k-websites skill used on Kanji): no em dashes anywhere, none of leverage, seamless, empower,
  unlock, robust, actionable, data-driven, solutions, testament, landscape, delve, elevate.

## Images (Higgsfield, gpt_image_2_5, quality high, 2k, 2.75 credits each)

All four are AI-generated; the footer says so. Replace with real photos when the owner provides them.
Raw PNGs are not committed; re-download from the job IDs if needed.

- `hero-box.webp` (transparent cutout): kraft box with ambasha, three sambusas, rolled injera. Job edfc7e1f-6c5f-4884-bff3-7c09d7c35f27
- `sambusa.webp` (transparent cutout): single sambusa. Job 6fb3c39d-e607-4872-8fd2-d2afb1b84237
- `bakery.webp` (4:5): folded injera and an ambasha loaf on green linen. Job e342e976-4ac4-48ff-8f6f-99dbf7954437
- `platter.webp` (1:1): vegetarian combination on injera. Job c90aa501-c75d-41d5-9e15-33d886da41b2

## Layout

- `site/index.html` + `site/assets/`: plain HTML/CSS/vanilla JS, no build step. `site.css` holds the tokens and sections,
  `reviews.css`/`reviews.js` the review belt (same component as Kanji), `main.js` nav, tabs and hours.
- Preview: `node scripts/build-preview.js` writes `.preview/index.html`, one self-contained file with CSS, JS and
  images inlined that opens anywhere. `--artifact` writes `.preview/live.html` for the live link (see the standing rule).
- Nothing meant to be read may rest at opacity 0 waiting for a scroll or load animation: entrances move, they never fade
  in from invisible, so thumbnails and full-page captures show the whole page.
- Deploy: static host of `site/`. Patch the `DEPLOY STEP` comment (og:url, og:image) once the domain exists.
