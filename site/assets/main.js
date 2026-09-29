(() => {
  // Pause the ambient loops (blobs, seal) on hidden tabs.
  document.addEventListener("visibilitychange", () => document.body.classList.toggle("paused", document.hidden));

  /* ---------- Nav: a soft edge once the page moves under it ---------- */
  const nav = document.querySelector("[data-nav]");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Hero box: the band and headline still stand if the image is missing ---------- */
  const heroImg = document.querySelector("[data-hero-img]");
  if (heroImg) {
    const hide = () => { heroImg.hidden = true; };
    heroImg.addEventListener("error", hide);
    if (heroImg.complete && !heroImg.naturalWidth) hide();
  }

  /* ---------- Menu tabs (ARIA tabs pattern) ---------- */
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const select = tab => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", e => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); const n = tabs[(i + k + tabs.length) % tabs.length]; select(n); n.focus(); }
      if (e.key === "Home") { e.preventDefault(); select(tabs[0]); tabs[0].focus(); }
      if (e.key === "End") { e.preventDefault(); select(tabs.at(-1)); tabs.at(-1).focus(); }
    });
  });

  /* ---------- Dish cards: open the dish's tab and point at it in the list ---------- */
  document.querySelectorAll(".dish-card").forEach(card => {
    card.addEventListener("click", e => {
      const item = document.getElementById(card.hash.slice(1));
      const panel = item && item.closest('[role="tabpanel"]');
      const tab = panel && document.querySelector(`[aria-controls="${panel.id}"]`);
      if (!tab) return;
      e.preventDefault();
      select(tab);
      item.tabIndex = -1;
      item.focus({ preventScroll: true });
      item.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      item.classList.remove("is-flash");
      void item.offsetWidth; // restart the highlight when the same card is clicked twice
      item.classList.add("is-flash");
    });
  });

  /* ---------- Hours with today + open now (Springfield time) ---------- */
  // From Google and Yelp: Mon-Sat 9 AM - 9 PM, Sun 9 AM - 8 PM.
  const HOURS = [ // index = day of week, 0 = Sunday. [open, close] in 24h
    ["Sunday", 9, 20], ["Monday", 9, 21], ["Tuesday", 9, 21], ["Wednesday", 9, 21],
    ["Thursday", 9, 21], ["Friday", 9, 21], ["Saturday", 9, 21]
  ];
  const fmt = h => `${h > 12 ? h - 12 : h} ${h >= 12 ? "PM" : "AM"}`;
  const body = document.querySelector("[data-hours]");
  if (body) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23"
    }).formatToParts(new Date()).map(p => [p.type, p.value]));
    const today = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
    const now = +parts.hour + parts.minute / 60;

    // Show Monday first, the way people read a week.
    [1, 2, 3, 4, 5, 6, 0].forEach(d => {
      const [name, o, c] = HOURS[d];
      const tr = document.createElement("tr");
      if (d === today) tr.className = "is-today";
      tr.innerHTML = `<td>${name}</td><td>${fmt(o)} to ${fmt(c)}</td>`;
      body.append(tr);
    });

    const pill = document.querySelector("[data-open-pill]");
    if (today >= 0) {
      const [, o, c] = HOURS[today];
      const open = now >= o && now < c;
      pill.classList.toggle("is-open", open);
      pill.textContent = open ? `Open now · until ${fmt(c)}` : now < o ? `Opens today at ${fmt(o)}` : `Closed now · opens at ${fmt(HOURS[(today + 1) % 7][1])}`;
    }
  }
})();
