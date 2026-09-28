/* Guest reviews from Yelp, read through Yahoo Local's Yelp feed (Yelp itself blocks automated reads).
   The feed only shows the opening of each review, so each body is quoted verbatim up to the last
   complete sentence it shows. Stars and dates are as posted on Yelp.
   Not used: one 1-star review (Daniela T., 2023). Swap in owner-supplied reviews here when available. */
const REVIEWS = [
  {
    name: "Eliana M.",
    place: "Yelp review",
    date: "2022-09-02",
    rating: 5,
    pull: "The injera was amazing.",
    body: [
      "A nice and local Ethiopian restaurant...ordered the doro wot with lentils and it was neatly individually portioned. The injera was amazing."
    ]
  },
  {
    name: "Bethel W.",
    place: "Yelp review",
    date: "2022-06-30",
    rating: 5,
    pull: "He thoroughly enjoyed his meal.",
    body: [
      "I just appreciate the delivery was exactly as I requested. This was sent to my dad on Father's Day and he was recovering from the vid so he thoroughly enjoyed his meal (still had his taste)!"
    ]
  },
  {
    name: "Kay M.",
    place: "Yelp review",
    date: "2017-07-29",
    rating: 4,
    pull: "Everyone there is really sweet.",
    body: [
      "Everyone there is really sweet, but no one there really speaks English, which probably makes it more authentic, but hard to figure out what you're ordering."
    ]
  },
  {
    name: "Jamie C.",
    place: "Yelp review",
    date: "2017-09-29",
    rating: 3,
    pull: "So wonderful to have it close to home.",
    body: [
      "So delicious...but sooooo hard to order. Would be 5 stars is for the food. I typically get Ethiopian food in falls church but it's so wonderful to have it close to home."
    ]
  }
];

(() => {
  const section = document.querySelector(".reviews");
  if (!section) return;
  const track = section.querySelector(".belt__track");
  const prev = section.querySelector("[data-belt-prev]");
  const next = section.querySelector("[data-belt-next]");
  const pauseBtn = section.querySelector("[data-belt-pause]");
  const status = section.querySelector("[data-belt-status]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  const STEP_MS = 7000;

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const stars = n => {
    const wrap = el("span", "stars");
    wrap.setAttribute("role", "img");
    wrap.setAttribute("aria-label", `${n} out of 5 stars`);
    for (let i = 0; i < 5; i++) {
      const s = el("span", i < n ? "star star--on" : "star");
      s.setAttribute("aria-hidden", "true");
      wrap.append(s);
    }
    return wrap;
  };

  REVIEWS.forEach((r, i) => {
    const li = el("li", "plate");
    li.style.setProperty("--i", i);
    const card = el("article", "plate__card");
    const id = `review-${i}`;
    card.setAttribute("aria-labelledby", `${id}-name`);

    const head = el("header", "plate__head");
    const mono = el("span", "plate__dish", r.name.split(" ").map(w => w[0]).join(""));
    mono.setAttribute("aria-hidden", "true");
    const who = el("div", "plate__who");
    const name = el("h3", "plate__name", r.name);
    name.id = `${id}-name`;
    if (r.badge) name.append(" ", el("span", "plate__badge", r.badge));
    who.append(name, el("p", "plate__place", r.place));
    head.append(mono, who);

    const meta = el("p", "plate__meta");
    const time = el("time", null, fmt.format(new Date(r.date)));
    time.dateTime = r.date;
    meta.append(stars(r.rating), time);

    const quote = el("blockquote", "plate__quote");
    quote.append(el("p", "plate__pull", `“${r.pull}”`));
    const body = el("div", "plate__body");
    body.id = `${id}-body`;
    r.body.forEach(p => body.append(el("p", null, p)));
    quote.append(body);

    const more = el("button", "plate__more", "Read full review");
    more.type = "button";
    more.hidden = true;
    more.setAttribute("aria-controls", body.id);
    more.setAttribute("aria-expanded", "false");
    more.addEventListener("click", () => {
      const open = card.classList.toggle("is-open");
      more.setAttribute("aria-expanded", String(open));
      more.textContent = open ? "Show less" : "Read full review";
      sync();
    });

    card.append(head, meta, quote, more);
    li.append(card);
    track.append(li);
  });

  // Only offer "Read full review" where the clamp actually hides text.
  const measure = () => {
    track.querySelectorAll(".plate__card").forEach(card => {
      if (card.classList.contains("is-open")) return;
      const body = card.querySelector(".plate__body");
      card.querySelector(".plate__more").hidden = body.scrollHeight <= body.clientHeight + 2;
    });
  };

  const plates = () => [...track.children];
  const current = () => {
    const x = track.scrollLeft;
    let best = 0, dist = Infinity;
    plates().forEach((p, i) => {
      const d = Math.abs(p.offsetLeft - track.offsetLeft - x);
      if (d < dist) { dist = d; best = i; }
    });
    return best;
  };
  const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  const go = i => {
    const list = plates();
    const target = list[(i + list.length) % list.length];
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: reduced.matches ? "auto" : "smooth" });
  };
  const step = dir => {
    if (dir > 0 && atEnd()) go(0);
    else if (dir < 0 && track.scrollLeft <= 4) go(plates().length - 1);
    else go(current() + dir);
  };

  prev.addEventListener("click", () => step(-1));
  next.addEventListener("click", () => step(1));
  track.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  });

  // The belt moves on its own until anything says stop.
  const hold = { user: false, hover: false, focus: false, offscreen: true, hidden: document.hidden };
  let timer = 0;
  const running = () =>
    !reduced.matches && !hold.user && !hold.hover && !hold.focus && !hold.offscreen && !hold.hidden &&
    !track.querySelector(".is-open");

  function sync() {
    const on = running();
    section.classList.toggle("is-running", on);
    clearInterval(timer);
    if (on) timer = setInterval(() => step(1), STEP_MS);
  }

  pauseBtn.addEventListener("click", () => {
    hold.user = !hold.user;
    pauseBtn.setAttribute("aria-pressed", String(hold.user));
    pauseBtn.querySelector("span").textContent = hold.user ? "Play" : "Pause";
    status.textContent = hold.user ? "Reviews paused" : "Reviews moving";
    sync();
  });
  const belt = section.querySelector(".belt");
  belt.addEventListener("pointerenter", () => { hold.hover = true; sync(); });
  belt.addEventListener("pointerleave", () => { hold.hover = false; sync(); });
  belt.addEventListener("focusin", () => { hold.focus = true; sync(); });
  belt.addEventListener("focusout", e => {
    if (!belt.contains(e.relatedTarget)) { hold.focus = false; sync(); }
  });
  document.addEventListener("visibilitychange", () => { hold.hidden = document.hidden; sync(); });
  reduced.addEventListener("change", sync);

  // Already on screen at load: show the cards now rather than waiting on the observer.
  if (section.getBoundingClientRect().top < innerHeight) section.classList.add("in");

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) section.classList.add("in");
    hold.offscreen = !entry.isIntersecting;
    sync();
  }, { threshold: 0.25 }).observe(section);

  // Retire the entrance stagger once it has played, so hovers never lag.
  section.addEventListener("transitionend", e => {
    if (e.target.classList.contains("plate") && e.propertyName === "transform") e.target.classList.add("is-settled");
  });

  measure();
  addEventListener("resize", measure);
  document.fonts && document.fonts.ready.then(measure);
  sync();
})();
