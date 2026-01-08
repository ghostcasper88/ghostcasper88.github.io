/* script.js
   8Q Personality Quiz (Q1 shelf + Q2–Q8 answers)
   - Loader + sword fill (LEFT→RIGHT) using scaleX on .swordFill
   - Adds .ready on loading screen when finished (for gradient overlay)
   - Tie-break page if needed
   - Scroll/focus fix for mobile
*/

document.addEventListener("DOMContentLoaded", () => {
  (async function main() {
    "use strict";

    // -----------------------------
    // CONFIG
    // -----------------------------
    const MIN_LOADER_MS = 10000; // minimum time before 100%
    const FINISH_MS = 600;       // last 10% smooth finish duration
    const clamp01 = (n) => Math.max(0, Math.min(1, n));

    // -----------------------------
    // PERSONALITIES / MAGICS (keys stay color-based to match picks)
    // -----------------------------
    const PERSONALITIES = [
      {
        key: "red",
        name: "Winds",
        title: "Chosen by the Winds",
        desc: "A red soul: passionate, untamed, and built for the journey.",
        tags: ["Free Soul", "Nomadic", "Passionate"],
        icon: "image/red.png",
        resultImage: "image/wind.png",
        bodyHtml: `
          <p><strong>Winds</strong> don’t ask permission—they move.</p>
          <p>Your magic rises from a <strong>free soul</strong>, fueled by emotion, momentum, and the pull of open horizons. Outsiders often mistake your intensity for aggression, but the truth is simpler: you feel deeply, and you live honestly.</p>
          <p>Those Chosen by the Winds tend to thrive in rugged climates and high places—beautiful mountainside cities, migrating with weather and conditions as needed. Community matters here: tough from a young age, but loyal, protective, and surprisingly warm once you’re “in.”</p>
          <p><em>If you’re Chosen by the Winds, you’re a free spirit—someone who values the road, the story, and the people beside you more than any final destination.</em></p>
        `,
      },
      {
        key: "orange",
        name: "Flame",
        title: "Chosen by the Flame",
        desc: "A focused soul: disciplined heat, tradition, and watchful devotion.",
        tags: ["Focused Soul", "Disciplined", "Traditional"],
        icon: "image/orange.png",
        resultImage: "image/flame.png",
        bodyHtml: `
          <p><strong>Flame</strong> is not chaos—it’s control.</p>
          <p>Your power comes from a <strong>focused soul</strong>: emotions contained, understood, and directed like a steady torch in a storm. Those chosen by the Flame often carry deep respect for history, ritual, and the spirits that shaped their region.</p>
          <p>They’re protective of culture and stubborn about what matters—yet not closed-minded. Recent conflict and leadership fractures have pushed many to migrate, bringing new voices into old halls. In times like this, Flame learns what it truly is: fear… or courage.</p>
          <p><em>If you’re Chosen by the Flame, you’re steady under pressure—and when you act, you do so with purpose.</em></p>
        `,
      },
      {
        key: "yellow",
        name: "Harvest",
        title: "Chosen by the Harvest",
        desc: "A controlled body: strength, service, and the pride of being useful.",
        tags: ["Focused Body", "Provider", "Enduring"],
        icon: "image/yellow.png",
        resultImage: "image/harvest.png",
        bodyHtml: `
          <p><strong>Harvest</strong> is the magic of strength and sheer will.</p>
          <p>Your gift is drawn through a <strong>controlled body</strong>—muscle, bone, and blood made into a channel. That control becomes strength: the kind needed to protect, to build, and to feed entire regions.</p>
          <p>Harvest communities live simply, but not small. Fields stretch far, leadership shifts crop-to-crop, and generosity runs deep—though it’s often tied to a strong inner drive: the desire to live a full, useful life.</p>
          <p><em>If you’re Chosen by the Harvest, you’re reliable power—someone people lean on when things get real.</em></p>
        `,
      },
      {
        key: "green",
        name: "Forest",
        title: "Chosen by the Forest",
        desc: "A free body: flowing instincts, artistry, and magic that dances.",
        tags: ["Free Body", "Artistic", "Spiritual"],
        icon: "image/green.png",
        resultImage: "image/forest.png",
        bodyHtml: `
          <p><strong>Forest</strong> does not force—it guides.</p>
          <p>Your magic is born from a <strong>free body</strong>: you sense energy and move with it, like dancing. Forest folk tend to be musical, expressive, and alive to subtle shifts—wind through leaves, current through roots.</p>
          <p>Spirituality runs deep here. Many believe the dead become part of the forest itself, woven into the region’s living magic. Communities form in smaller pods along waterways, with larger leadership shared across five major family lines.</p>
          <p><em>If you’re Chosen by the Forest, you’re intuitive and creative—and you trust flow over force.</em></p>
        `,
      },
      {
        key: "blue",
        name: "Sea",
        title: "Chosen by the Sea",
        desc: "A free, creative mind: curiosity, craft, and endless horizons.",
        tags: ["Free Mind", "Curious", "Creative"],
        icon: "image/blue.png",
        resultImage: "image/sea.png",
        bodyHtml: `
          <p><strong>Sea</strong> is learning and adaptation turned into power.</p>
          <p>Your gift is shaped by a <strong>free mind</strong>—the kind that explores, questions, combines, and invents. Sea mages treat education and art like essentials, not luxuries.</p>
          <p>The region is a scattered chain of archipelagos with cities that span both above-water neighborhoods and underwater districts. The ruling family’s island holds the largest university—an engine of new spells, new ideas, and bold collaboration with other magics.</p>
          <p><em>If you’re Chosen by the Sea, you’re a builder of possibilities—and you’re never done learning, albiet maybe a little scatter-brained.</em></p>
        `,
      },
      {
        key: "purple",
        name: "Stone",
        title: "Chosen by Stone",
        desc: "A focused mind: strategy, precision, and unshakable defense.",
        tags: ["Focused Mind", "Strategic", "Resilient"],
        icon: "image/purple.png",
        resultImage: "image/stone.png",
        bodyHtml: `
          <p><strong>Stone</strong> is patience with an edge.</p>
          <p>Your power comes from a <strong>focused mind</strong>—meticulous, planning-oriented, and sometimes so precise it becomes tunnel vision. Stone folk are famously defensive, but not passive: when needed, they strike with deliberate force.</p>
          <p>The region is rocky and harsh, yet its cities are crafted masterpieces—safe, beautiful, and built to endure. A central ruling family leads from the largest city, with strict control on those around it. Order is crucial after all.</p>
          <p><em>If you’re Chosen by Stone, you’re a force of reason that always ensures that a plan is in place.</em></p>
        `,
      },
    ];

    // -----------------------------
    // QUESTIONS (8 total)
    // -----------------------------
    const QUESTIONS = [
      {
        id: 1,
        text: "Choose The Sparked Item That Calls To You.",
        image: "image/shelf.png",
        caption: "Choose Wisely!",
        answers: [
          { text: "Teapot",  pick: "blue",   img: "image/teapot.png" },
          { text: "Flute",   pick: "green",  img: "image/flute.png" },
          { text: "Bottle",  pick: "red",    img: "image/bottle.png" },
          { text: "Trowel",  pick: "yellow", img: "image/trowel.png" },
          { text: "Cloak",   pick: "orange", img: "image/cloak.png" },
          { text: "Amulet",  pick: "purple", img: "image/amulet.png" },
        ],
      },
      {
        id: 2,
        text: "Question 2: Which of the following treasures is most valuable to your character?",
        image: "image/q2.png",
        caption: "",
        answers: [
          { text: "An ancient book written before the Prism",                  pick: "purple" },
          { text: "A sparked item with potential for a new magic combination", pick: "blue"   },
          { text: "A new medicine",                                            pick: "green"  },
          { text: "I don't care about treasure",                               pick: "yellow" },
          { text: "A sparked artifact taken from my homeland",                 pick: "orange" },
          { text: "The journey was the real treasure",                         pick: "red"    },
        ],
      },
      {
        id: 3,
        text: "Question 3: You have found yourself locked in a room. What do you do?",
        image: "image/q3.png",
        caption: "",
        answers: [
          { text: "Look for another way out",                pick: "blue"   },
          { text: "Yell for help",                           pick: "red"    },
          { text: "Meditate and wait",                       pick: "orange" },
          { text: "Smash the door down",                     pick: "yellow" },
          { text: "Think of the perfect spell",              pick: "purple" },
          { text: "Calmly call to see if anyone is outside", pick: "green"  },
        ],
      },
      {
        id: 4,
        text: "Question 4: A spell misfires in a crowded market—magic spills everywhere. You…",
        image: "image/q4.png",
        caption: "",
        answers: [
          { text: "Step forward and fight.",                                                                  pick: "red"    },
          { text: "Lower your voice, slow your breath, and contain the flare.",                                pick: "orange" },
          { text: "Move with the chaos—dodging, weaving, guiding others out.",                                 pick: "green"  },
          { text: "Plant your stance, shield a child, and take control physically.",                           pick: "yellow" },
          { text: "Laugh, improvise, and turn the accident into a harmless spectacle.",                        pick: "blue"   },
          { text: "Analyse where the spell came from and what kind of spell it was before going on defense.", pick: "purple" },
        ],
      },
      {
        id: 5,
        text: "Question 5: To get to the Well of the Harvest is dangerous. What is your strategy?",
        image: "image/q5.png",
        caption: "",
        answers: [
          { text: "Trust your heart and the people closest to you.",     pick: "red"    },
          { text: "Trust in the spirits understanding your intentions.", pick: "orange" },
          { text: "Trust in your survival skills and intuition.",        pick: "green"  },
          { text: "Trust in your strength.",                             pick: "yellow" },
          { text: "Trust in your ability to adapt and overcome.",        pick: "blue"   },
          { text: "Trust in your research.",                             pick: "purple" },
        ],
      },
      {
        id: 6,
        text: "Question 6: You’re asked to guard a sacred relic overnight that you believe someone is trying to steal. What’s your method?",
        image: "image/q6.png",
        caption: "",
        answers: [
          { text: "Invite the room’s spirits to watch with you.",                pick: "red"    },
          { text: "Set wards in perfect layers and keep a strict routine.",      pick: "orange" },
          { text: "Stay moving—circling, listening, sensing shifts in the air.", pick: "green"  },
          { text: "Build a physical barricade and keep your weapon ready.",      pick: "yellow" },
          { text: "Leave a decoy and hide surprises for the would-be thieves.",  pick: "blue"   },
          { text: "Map every entrance, angle, and timing—then predict threats.", pick: "purple" },
        ],
      },
      {
        id: 7,
        text: "Question 7: You and a friend are hiding from a dangerous beast in the dense forest. Its footsteps are close. What’s your move?",
        image: "image/q7.png",
        caption: "",
        answers: [
          { text: "You work well together, it will be an easy fight if it comes to it.", pick: "red"    },
          { text: "Hide for now, but if it comes to it you must be the sacrifice.",      pick: "orange" },
          { text: "Feel its magic. When it goes away, be quick to slip away silently.",  pick: "green"  },
          { text: "Freeze, and prepare to shield as needed in case of a fight.",         pick: "yellow" },
          { text: "Move to an area where you have control over the imminent fight.",     pick: "blue"   },
          { text: "Build a plan: escape route, backup route, and a timed distraction.",  pick: "purple" },
        ],
      },
      {
        id: 8,
        text: "Question 8: You find a mirror that shows the life you almost lived. You can step through.",
        image: "image/q8.png",
        caption: "",
        answers: [
          { text: "Figure out what you truly want. Trust your gut—and your heart—before entering.", pick: "red"    },
          { text: "Refuse the temptation and commit to the life you were given.",                   pick: "orange" },
          { text: "Put your arm in first, enter slowly, and feel the magic to see if you belong.", pick: "green"  },
          { text: "Break the mirror. It is likely a trap.",                                         pick: "yellow" },
          { text: "Take notes. Maybe you can replicate this magic yourself.",                       pick: "blue"   },
          { text: "Study consequences first—choose only if the outcome is worth it.",               pick: "purple" },
        ],
      },
    ];

    // -----------------------------
    // STATE
    // -----------------------------
    let index = 0;
    const picks = Array(QUESTIONS.length).fill(null);
    let tiePick = null;
    let finalWinnerKey = null;

    // -----------------------------
    // SHUFFLE (stable per question)
    // -----------------------------
    function shuffleCopy(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
    const shuffledAnswersById = {};

    // -----------------------------
    // DOM
    // -----------------------------
    const pages = {
      start: document.getElementById("page-start"),
      question: document.getElementById("page-question"),
      tie: document.getElementById("page-tie"),
      result: document.getElementById("page-result"),
    };

    const barFill = document.getElementById("barFill");
    const barText = document.getElementById("barText");

    const qNum = document.getElementById("qNum");
    const qText = document.getElementById("qText");
    const answersEl = document.getElementById("answers");

    const qMedia = document.getElementById("qMedia");
    const qImage = document.getElementById("qImage");
    const qCaption = document.getElementById("qCaption");

    const q1ShelfWrap = document.getElementById("q1ShelfWrap");
    const shelfEl = document.getElementById("shelf");

    const btnBegin = document.getElementById("btnBegin");
    const btnBack = document.getElementById("btnBack");
    const btnNext = document.getElementById("btnNext");
    const btnRestart = document.getElementById("btnRestart");
    const btnShare = document.getElementById("btnShare");

    const resultTitle = document.getElementById("resultTitle");
    const resultDesc = document.getElementById("resultDesc");
    const resultBody = document.getElementById("resultBody");
    const resultTags = document.getElementById("resultTags");
    const scoreBreakdown = document.getElementById("scoreBreakdown");
    const resultImageBox = document.getElementById("resultImageBox");
    const resultImage = document.getElementById("resultImage");

    // tie page
    const tieText = document.getElementById("tieText");
    const tieShelf = document.getElementById("tieShelf");
    const btnTieBack = document.getElementById("btnTieBack");
    const btnTieConfirm = document.getElementById("btnTieConfirm");

    // audio
    const bgm = document.getElementById("bgm");
    const audioVol = document.getElementById("audioVol");

    // loader
    const loadingScreen = document.getElementById("loadingScreen");
    const loadingText = document.getElementById("loadingText");
    const loadingFill = document.getElementById("loadingFill"); // .swordFillClip
    const btnEnter = document.getElementById("btnEnter");
    const loadingLiquid = loadingFill ? loadingFill.querySelector(".swordFill") : null;

    const required = [
      pages.start, pages.question, pages.tie, pages.result,
      btnBegin, btnNext, btnBack,
      loadingScreen, loadingFill, loadingText, btnEnter,
      tieShelf, btnTieConfirm, btnTieBack
    ];
    if (required.some(x => !x)) {
      console.error("Missing required HTML elements. Check your IDs (page-start, page-question, page-tie, page-result, etc).");
      return;
    }

    // -----------------------------
    // SCROLL FIX
    // -----------------------------
    function getScrollHost() {
      const main = document.getElementById("app");
      const doc = document.scrollingElement || document.documentElement;
      if (main && main.scrollHeight > main.clientHeight + 2) return main;
      return doc;
    }
    function resetScrollTop() {
      const host = getScrollHost();
      if (host) host.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    function resetScrollTopAfterPaint() {
      requestAnimationFrame(() => requestAnimationFrame(resetScrollTop));
    }

    // -----------------------------
    // UI HELPERS
    // -----------------------------
    function show(pageName) {
      Object.values(pages).forEach(p => p && p.classList.remove("active"));
      pages[pageName]?.classList.add("active");
    }

    function setProgress() {
      const total = QUESTIONS.length;

      if (pages.tie.classList.contains("active")) {
        barFill.style.width = "100%";
        barText.textContent = "Tie-break";
        return;
      }

      const pct = pages.question.classList.contains("active")
        ? Math.round(((index + 1) / total) * 100)
        : pages.result.classList.contains("active")
          ? 100
          : 0;

      barFill.style.width = `${pct}%`;
      barText.textContent =
        pages.question.classList.contains("active") ? `Progress: ${index + 1}/${total}` :
        pages.result.classList.contains("active") ? "Complete" :
        "Start";
    }

    function updateNextDisabled() {
      btnNext.disabled = (picks[index] == null);
    }

    function renderMedia(q) {
      if (q.image) {
        qMedia.style.display = "block";
        qImage.src = q.image;
        qImage.alt = `Illustration for question ${q.id}`;
        qCaption.textContent = q.caption || "";
      } else {
        qMedia.style.display = "none";
        qImage.src = "";
        qCaption.textContent = "";
      }
    }

    function markSelected(container, itemSelector, selectedEl) {
      container.querySelectorAll(itemSelector).forEach(el => el.classList.remove("selected"));
      if (selectedEl) selectedEl.classList.add("selected");
    }

    function wireNoFocusSelect(label, input, onSelect) {
      label.tabIndex = 0;

      const select = () => {
        if (!input.checked) input.checked = true;
        onSelect();
      };

      label.addEventListener("pointerdown", (e) => { e.preventDefault(); select(); }, { passive: false });
      label.addEventListener("mousedown", (e) => { e.preventDefault(); select(); });
      label.addEventListener("touchstart", (e) => { e.preventDefault(); select(); }, { passive: false });
      label.addEventListener("click", (e) => { e.preventDefault(); select(); });

      label.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(); }
      });

      input.addEventListener("focus", () => { try { input.blur(); } catch {} });
    }

    // -----------------------------
    // AUDIO
    // -----------------------------
    function safePlay() {
      if (!bgm) return;
      if (audioVol) bgm.volume = Number(audioVol.value || 0.6);
      bgm.play().catch(() => {});
    }
    if (bgm && audioVol) {
      bgm.volume = Number(audioVol.value || 0.6);
      audioVol.addEventListener("input", () => { bgm.volume = Number(audioVol.value); });
    }

    // -----------------------------
    // PRELOADING
    // -----------------------------
    function preloadAndDecodeImage(src, timeoutMs = 15000) {
      return new Promise((resolve) => {
        if (!src) return resolve(true);
        const url = new URL(src, document.baseURI).href;
        const img = new Image();
        let done = false;

        const finish = (ok) => {
          if (done) return;
          done = true;
          resolve(ok);
        };

        const t = setTimeout(() => finish(false), timeoutMs);

        img.onload = async () => {
          clearTimeout(t);
          try { await img.decode(); } catch {}
          finish(true);
        };
        img.onerror = () => { clearTimeout(t); finish(false); };

        img.src = url;
      });
    }

    function preloadAudio(audioEl, timeoutMs = 15000) {
      return new Promise((resolve) => {
        if (!audioEl || !audioEl.src) return resolve({ ok: true, src: "" });

        let done = false;
        const finish = (ok) => {
          if (done) return;
          done = true;
          resolve({ ok, src: audioEl.src });
        };

        const t = setTimeout(() => finish(false), timeoutMs);
        const onReady = () => { clearTimeout(t); finish(true); };
        const onErr = () => { clearTimeout(t); finish(false); };

        audioEl.addEventListener("canplaythrough", onReady, { once: true });
        audioEl.addEventListener("loadedmetadata", onReady, { once: true });
        audioEl.addEventListener("error", onErr, { once: true });

        audioEl.load();
      });
    }

    // -----------------------------
    // LOADER
    // -----------------------------
    function loaderMessageForPct(pct) {
      if (pct < 34) return "Exploring City...";
      if (pct < 67) return "Celebrating Festivities...";
      return "Entering Square...";
    }

    async function runLoaderAndPreload() {
      const fail = (msg, err) => {
        console.error(msg, err);
        if (loadingText) loadingText.textContent = `Loader error: ${msg}${err?.message ? " — " + err.message : ""}`;
        if (btnEnter) btnEnter.disabled = false;
      };

      try {
        loadingScreen.classList.add("active");
        loadingScreen.classList.remove("ready"); // start white each time
        btnBegin.disabled = true;
        btnEnter.disabled = true;

        if (loadingLiquid) loadingLiquid.style.transform = "scaleX(0)";

        // Build asset list
        const urls = [];
        for (const q of QUESTIONS) {
          if (q.image) urls.push(q.image);
          for (const a of (q.answers || [])) if (a.img) urls.push(a.img);
        }
        for (const p of PERSONALITIES) if (p.icon) urls.push(p.icon);

        const extractCssUrl = (val) => {
          const m = String(val || "").match(/url\((["']?)(.*?)\1\)/i);
          return m ? m[2] : "";
        };
        const shelfBg1 = shelfEl ? getComputedStyle(shelfEl).getPropertyValue("--shelf-img") : "";
        const shelfBg2 = tieShelf ? getComputedStyle(tieShelf).getPropertyValue("--shelf-img") : "";
        const bg1 = extractCssUrl(shelfBg1);
        const bg2 = extractCssUrl(shelfBg2);
        if (bg1) urls.push(bg1);
        if (bg2) urls.push(bg2);

        const unique = Array.from(new Set(urls.filter(Boolean)));
        const includeAudio = !!(bgm && bgm.src);

        let preloadDone = false;
        const start = performance.now();
        let finishStart = null;

        const setSword = (p01) => {
          const p = clamp01(p01);
          const pct = Math.round(p * 100);
          if (loadingLiquid) loadingLiquid.style.transform = `scaleX(${p})`;
          if (loadingText) loadingText.textContent = `${loaderMessageForPct(pct)} (${pct}%)`;
        };

        const tick = () => {
          const elapsed = performance.now() - start;

          // 0 -> 90% over MIN_LOADER_MS
          const time01 = clamp01(elapsed / MIN_LOADER_MS);
          let shown = time01 * 0.90;

          const timeGate = elapsed >= MIN_LOADER_MS;

          // last 10% when both time + preload are done
          if (timeGate && preloadDone) {
            if (!finishStart) finishStart = performance.now();
            const f01 = clamp01((performance.now() - finishStart) / FINISH_MS);
            shown = 0.90 + f01 * 0.10;
          } else if (timeGate && !preloadDone) {
            shown = 0.90;
          }

          setSword(shown);

          const ready = timeGate && preloadDone;
          btnEnter.disabled = !ready;

          if (ready && shown >= 0.999) {
            setSword(1);
            btnBegin.disabled = false;
            loadingScreen.classList.add("ready"); // triggers your gradient overlay CSS
            if (loadingText) loadingText.textContent = "Loaded! Press Enter to begin.";
            return;
          }

          requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);

        await Promise.all(unique.map(src => preloadAndDecodeImage(src)));

        if (includeAudio) {
          const ar = await preloadAudio(bgm);
          if (!ar.ok) console.warn("Audio preload failed:", ar.src);
        }

        preloadDone = true;
      } catch (err) {
        fail("runLoaderAndPreload crashed", err);
      }
    }

    // -----------------------------
    // LOADER ENTER
    // -----------------------------
    function enterFromLoad() {
      safePlay();
      loadingScreen.classList.remove("active");
      loadingScreen.classList.remove("ready");
      show("start");
      setProgress();
      resetScrollTopAfterPaint();
    }

    btnEnter.addEventListener("click", enterFromLoad);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && loadingScreen.classList.contains("active") && !btnEnter.disabled) {
        enterFromLoad();
      }
    });

    // Start loader immediately
    await runLoaderAndPreload();

    // -----------------------------
    // RENDERERS
    // -----------------------------
    function renderShelfQuestion(q) {
      q1ShelfWrap.style.display = "block";
      answersEl.style.display = "none";
      answersEl.innerHTML = "";
      shelfEl.innerHTML = "";

      q.answers.forEach((a, ai) => {
        const id = `q${q.id}_s${ai}`;
        const label = document.createElement("label");
        label.className = "shelfItem";

        label.innerHTML = `
          <input type="radio" id="${id}" name="q${q.id}" value="${a.pick}">
          <img src="${a.img || ""}" alt="${a.text}">
          <span>${a.text}</span>
        `;

        const input = label.querySelector("input");
        if (picks[index] === a.pick) {
          input.checked = true;
          label.classList.add("selected");
        }

        wireNoFocusSelect(label, input, () => {
          picks[index] = a.pick;
          updateNextDisabled();
          markSelected(shelfEl, ".shelfItem", label);
        });

        shelfEl.appendChild(label);
      });

      updateNextDisabled();
    }

    function renderStandardQuestion(q) {
      q1ShelfWrap.style.display = "none";
      answersEl.style.display = "grid";
      answersEl.innerHTML = "";

      if (!shuffledAnswersById[q.id]) shuffledAnswersById[q.id] = shuffleCopy(q.answers);
      const answersToRender = shuffledAnswersById[q.id];

      answersToRender.forEach((a, ai) => {
        const id = `q${q.id}_a${ai}`;
        const label = document.createElement("label");
        label.className = "ans";

        label.innerHTML = `
          <span class="dot" aria-hidden="true"></span>
          <input type="radio" name="q${q.id}" id="${id}" value="${a.pick}">
          <div><div style="font-weight:750;">${a.text}</div></div>
        `;

        const input = label.querySelector("input");
        if (picks[index] === a.pick) {
          input.checked = true;
          label.classList.add("selected");
        }

        wireNoFocusSelect(label, input, () => {
          picks[index] = a.pick;
          updateNextDisabled();
          markSelected(answersEl, ".ans", label);
        });

        answersEl.appendChild(label);
      });

      updateNextDisabled();
    }

    function renderQuestion() {
      const q = QUESTIONS[index];

      qNum.textContent = `Question ${index + 1} of ${QUESTIONS.length}`;
      qText.textContent = q.text;

      renderMedia(q);

      if (index === 0) renderShelfQuestion(q);
      else renderStandardQuestion(q);

      btnBack.disabled = (index === 0);

      setProgress();
      resetScrollTopAfterPaint();
    }

    // -----------------------------
    // TIE-BREAK
    // -----------------------------
    function renderTieShelf(leaders) {
      tiePick = null;
      btnTieConfirm.disabled = true;
      tieShelf.innerHTML = "";

      tieText.textContent =
        leaders.length === 2
          ? "Two magics reach for you… choose the one that feels louder."
          : "Several magics pull at you… choose the one that feels true.";

      leaders.forEach((key) => {
        const p = PERSONALITIES.find(x => x.key === key);
        const img = (p && p.icon) ? p.icon : `image/${key}.png`;

        const label = document.createElement("label");
        label.className = "shelfItem";

        label.innerHTML = `
          <input type="radio" name="tiePick" value="${key}">
          <img src="${img}" alt="${p ? p.name : key}">
          <span>${p ? p.name : key}</span>
        `;

        const input = label.querySelector("input");
        wireNoFocusSelect(label, input, () => {
          tiePick = key;
          btnTieConfirm.disabled = false;
          markSelected(tieShelf, ".shelfItem", label);
        });

        tieShelf.appendChild(label);
      });

      setProgress();
      resetScrollTopAfterPaint();
    }

    // -----------------------------
    // SCORING (Q2–Q8)
    // -----------------------------
    function computeResult() {
      const counts = Object.fromEntries(PERSONALITIES.map(p => [p.key, 0]));
      for (let i = 1; i < QUESTIONS.length; i++) if (picks[i]) counts[picks[i]]++;

      const max = Math.max(...Object.values(counts));
      const leaders = Object.entries(counts)
        .filter(([, v]) => v === max)
        .map(([k]) => k);

      let winnerKey = leaders[0] || PERSONALITIES[0].key;

      if (leaders.length > 1) {
        const tieBreakPick = picks[0];
        if (tieBreakPick && leaders.includes(tieBreakPick)) winnerKey = tieBreakPick;
      }

      return { winnerKey, counts, leaders };
    }

    function renderResult(forcedWinnerKey = null) {
      const { winnerKey, counts, leaders } = computeResult();
      finalWinnerKey = forcedWinnerKey || winnerKey;

      const p = PERSONALITIES.find(x => x.key === finalWinnerKey) || PERSONALITIES[0];
       
// NEW: result image (keeps breakdown column intact)
if (resultImageBox && resultImage) {
  const src = p.resultImage || "";   // use resultImage, NOT icon
  if (src) {
    resultImage.src = src;
    resultImage.alt = p.title || p.name || "Result image";
    resultImageBox.style.display = "block";
  } else {
    resultImage.src = "";
    resultImage.alt = "";
    resultImageBox.style.display = "none";
  }
}


      // Title + short description
      resultTitle.textContent = p.title || `Chosen by the ${p.name}`;
      resultDesc.textContent = p.desc || "";

      // Long description
      resultBody.innerHTML = p.bodyHtml || "";

      // Tags
      resultTags.innerHTML = "";
      (p.tags || []).forEach(t => {
        const span = document.createElement("span");
        span.className = "pill";
        span.textContent = t;
        resultTags.appendChild(span);
      });

      // Debug breakdown
      const lines = PERSONALITIES.map(pp => `${pp.key.padEnd(7)} : ${counts[pp.key]}`).join("\n");
     

      barFill.style.width = "100%";
      barText.textContent = "Complete";

      resetScrollTopAfterPaint();
    }

    // -----------------------------
    // EVENTS
    // -----------------------------
    btnBegin.addEventListener("click", () => {
      safePlay();
      for (const k in shuffledAnswersById) delete shuffledAnswersById[k];
      tiePick = null;
      finalWinnerKey = null;
      index = 0;

      show("question");
      renderQuestion();
    });

    btnBack.addEventListener("click", () => {
      if (index > 0) {
        index--;
        show("question");
        renderQuestion();
      }
    });

    btnNext.addEventListener("click", () => {
      if (picks[index] == null) return;

      if (index < QUESTIONS.length - 1) {
        index++;
        show("question");
        renderQuestion();
        return;
      }

      const r = computeResult();
      if (r.leaders.length > 1) {
        show("tie");
        renderTieShelf(r.leaders);
      } else {
        show("result");
        renderResult(r.winnerKey);
      }

      setProgress();
    });

    btnTieBack.addEventListener("click", () => {
      show("question");
      index = QUESTIONS.length - 1;
      renderQuestion();
    });

    btnTieConfirm.addEventListener("click", () => {
      if (!tiePick) return;
      show("result");
      renderResult(tiePick);
      setProgress();
    });

    btnRestart.addEventListener("click", () => {
      for (let i = 0; i < QUESTIONS.length; i++) picks[i] = null;
      for (const k in shuffledAnswersById) delete shuffledAnswersById[k];
      tiePick = null;
      finalWinnerKey = null;

      index = 0;
      show("start");
      barFill.style.width = "0%";
      barText.textContent = "Start";
      resetScrollTopAfterPaint();
    });

    btnShare.addEventListener("click", async () => {
      const winner = finalWinnerKey || computeResult().winnerKey;
      const p = PERSONALITIES.find(x => x.key === winner) || PERSONALITIES[0];
      const text = `I was ${p.title || `Chosen by the ${p.name}`}!`;

      try {
        await navigator.clipboard.writeText(text);
        btnShare.textContent = "Copied!";
        setTimeout(() => (btnShare.textContent = "Copy result"), 900);
      } catch {
        alert(text);
      }
    });

    setProgress();
  })().catch((err) => {
    console.error("script.js crashed:", err);
  });
});
