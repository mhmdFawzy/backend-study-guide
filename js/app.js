import {
  PLAYLIST_URL,
  PHASES,
  backendConcepts,
  getConceptById,
} from "./concepts.js?v=6";
import {
  loadNotes,
  hasNote,
  renderNotesCard,
  setupBackupPanel,
  flushPendingNote,
} from "./notes.js?v=6";

const STORAGE_KEY = "backend-study-progress";

const HTTP_PRESETS = {
  GET: {
    method: "GET",
    path: "/api/users/42",
    status: 200,
    response: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "id": 42,\n  "name": "Alex",\n  "email": "alex@example.com"\n}`,
  },
  POST: {
    method: "POST",
    path: "/api/users",
    body: `{\n  "name": "Sam",\n  "email": "sam@example.com"\n}`,
    status: 201,
    response: `HTTP/1.1 201 Created\nContent-Type: application/json\nLocation: /api/users/43\n\n{\n  "id": 43,\n  "name": "Sam",\n  "email": "sam@example.com"\n}`,
  },
  PUT: {
    method: "PUT",
    path: "/api/users/42",
    body: `{\n  "name": "Alex Updated",\n  "email": "alex@example.com"\n}`,
    status: 200,
    response: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "id": 42,\n  "name": "Alex Updated",\n  "email": "alex@example.com"\n}`,
  },
  DELETE: {
    method: "DELETE",
    path: "/api/users/42",
    status: 204,
    response: `HTTP/1.1 204 No Content\n\n(no response body)`,
  },
};

const PIPELINE_STEPS = [
  { label: "Logger", desc: "Records the incoming request" },
  { label: "CORS", desc: "Adds cross-origin headers" },
  { label: "Body Parser", desc: "Parses JSON body" },
  { label: "Auth", desc: "Verifies JWT token" },
  { label: "Route Handler", desc: "Runs your business code" },
  { label: "Error Handler", desc: "Catches and formats errors" },
];

let activeId = backendConcepts[0].id;
let completed = new Set();
let quizAnswered = false;

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) completed = new Set(JSON.parse(raw));
  } catch {
    completed = new Set();
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderNav() {
  const nav = document.getElementById("nav");
  nav.innerHTML = PHASES.map((phase) => {
    const items = backendConcepts
      .filter((c) => c.phase === phase)
      .map((c) => {
        const isActive = c.id === activeId;
        const isDone = completed.has(c.id);
        const hasNotes = hasNote(c.id);
        return `<button class="nav-btn${isActive ? " active" : ""}" data-id="${c.id}">
          <span class="dot${isDone ? " done" : ""}">${isDone ? "✓" : "○"}</span>
          <span class="nav-title">${esc(c.title)}</span>
          ${hasNotes ? '<span class="nav-note" aria-label="Has notes">📝</span>' : ""}
        </button>`;
      })
      .join("");
    return `<div class="phase-label">${esc(phase)}</div>${items}`;
  }).join("");

  nav.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      flushPendingNote();
      activeId = btn.dataset.id;
      quizAnswered = false;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function renderProgress() {
  const total = backendConcepts.length;
  const done = completed.size;
  document.getElementById("progress-count").textContent = `${done}/${total}`;
  document.getElementById("progress-fill").style.width = `${Math.round((done / total) * 100)}%`;
}

function renderHttpPlayground() {
  let method = "GET";
  let sent = false;

  const container = document.createElement("div");
  container.className = "card dashed";
  container.innerHTML = `<h3>Try it: HTTP request builder</h3><div id="http-root"></div>`;

  function draw() {
    const preset = HTTP_PRESETS[method];
    const root = container.querySelector("#http-root");
    root.innerHTML = `
      <div class="method-btns">
        ${["GET", "POST", "PUT", "DELETE"].map((m) =>
          `<button class="btn btn-outline method-btn${m === method ? " active" : ""}" data-m="${m}">${m}</button>`
        ).join("")}
      </div>
      <div class="http-box">
        <div style="color:var(--muted);margin-bottom:0.25rem">Request</div>
        <div><span class="badge">${preset.method}</span> ${preset.path}</div>
        ${preset.body ? `<pre style="margin-top:0.75rem;background:transparent;padding:0">${esc(preset.body)}</pre>` : ""}
      </div>
      <button class="btn btn-primary" id="http-send">Send request →</button>
      ${sent ? `<div class="http-response" style="margin-top:1rem">
        <div style="margin-bottom:0.25rem">Response <span class="badge">${preset.status}</span></div>
        <pre style="background:transparent;padding:0;margin-top:0.5rem">${esc(preset.response)}</pre>
      </div>` : ""}
    `;

    root.querySelectorAll(".method-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        method = btn.dataset.m;
        sent = false;
        draw();
      });
    });
    root.querySelector("#http-send")?.addEventListener("click", () => {
      sent = true;
      draw();
    });
  }

  draw();
  return container;
}

function renderMiddlewarePipeline() {
  const container = document.createElement("div");
  container.className = "card dashed";
  container.innerHTML = `<h3>Try it: Middleware pipeline</h3>
    <p style="font-size:0.875rem;color:var(--muted);margin-bottom:1rem">Watch a request flow through each middleware layer in order.</p>
    <div id="pipeline-steps"></div>
    <div id="pipeline-msg"></div>
    <div style="display:flex;gap:0.5rem;margin-top:1rem">
      <button class="btn btn-primary" id="pipeline-run">Run pipeline</button>
      <button class="btn btn-outline" id="pipeline-reset">Reset</button>
    </div>`;

  let activeStep = -1;
  let done = false;

  function draw() {
    const stepsEl = container.querySelector("#pipeline-steps");
    stepsEl.innerHTML = PIPELINE_STEPS.map((step, i) => {
      const isActive = i === activeStep;
      const isPast = i < activeStep || done;
      return `${i > 0 ? '<div class="pipeline-arrow">↓</div>' : ""}
        <div class="pipeline-step${isActive ? " active" : ""}${isPast && !isActive ? " done" : ""}">
          <div class="num">${isPast && !isActive ? "✓" : i + 1}</div>
          <div><div class="step-title">${esc(step.label)}</div><div class="step-desc">${esc(step.desc)}</div></div>
        </div>`;
    }).join("");

    const msg = container.querySelector("#pipeline-msg");
    msg.innerHTML = done
      ? `<p class="quiz-feedback ok" style="margin-top:1rem">Response sent! Each layer ran in sequence. If auth failed at step 4, steps 5–6 would never run.</p>`
      : "";
  }

  container.querySelector("#pipeline-run").addEventListener("click", async () => {
    done = false;
    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      activeStep = i;
      draw();
      await new Promise((r) => setTimeout(r, 600));
    }
    done = true;
    activeStep = -1;
    draw();
  });

  container.querySelector("#pipeline-reset").addEventListener("click", () => {
    activeStep = -1;
    done = false;
    draw();
  });

  draw();
  return container;
}

function renderQuiz(quiz) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<h3>Quick check</h3><p style="font-weight:500;margin-bottom:0.75rem">${esc(quiz.question)}</p>`;

  const optionsEl = document.createElement("div");
  optionsEl.className = "quiz-options";

  let selected = null;

  function drawOptions() {
    optionsEl.innerHTML = quiz.options
      .map((opt, i) => {
        const answered = selected !== null;
        const isCorrect = i === quiz.correctIndex;
        const isSelected = selected === i;
        let cls = "quiz-option";
        if (answered && isCorrect) cls += " correct";
        if (answered && isSelected && !isCorrect) cls += " wrong";
        return `<button class="${cls}" data-i="${i}" ${answered ? "disabled" : ""}>${esc(opt)}</button>`;
      })
      .join("");

    optionsEl.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (selected !== null) return;
        selected = Number(btn.dataset.i);
        if (selected === quiz.correctIndex) {
          completed.add(activeId);
          saveProgress();
        }
        drawOptions();
        drawFeedback();
        renderNav();
        renderProgress();
        updateCompleteBtn();
      });
    });
  }

  function drawFeedback() {
    const existing = card.querySelector(".quiz-feedback");
    if (existing) existing.remove();
    if (selected === null) return;
    const ok = selected === quiz.correctIndex;
    const fb = document.createElement("p");
    fb.className = `quiz-feedback ${ok ? "ok" : "no"}`;
    fb.textContent = quiz.explanation;
    card.appendChild(fb);

    const retry = document.createElement("button");
    retry.className = "btn btn-outline";
    retry.style.marginTop = "0.75rem";
    retry.textContent = "Try again";
    retry.addEventListener("click", () => {
      selected = null;
      card.querySelector(".quiz-feedback")?.remove();
      retry.remove();
      drawOptions();
    });
    card.appendChild(retry);
  }

  drawOptions();
  card.appendChild(optionsEl);
  return card;
}

function renderContent() {
  const concept = getConceptById(activeId) ?? backendConcepts[0];
  const index = backendConcepts.findIndex((c) => c.id === activeId);

  document.getElementById("concept-badge").textContent =
    `Concept ${index + 1} of ${backendConcepts.length}`;

  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="tags">
      <span class="tag">${esc(concept.phase)}</span>
      ${concept.playlistNote ? `<span class="tag">${esc(concept.playlistNote)}</span>` : ""}
    </div>
    <h2>${esc(concept.title)}</h2>
    <p class="summary">${esc(concept.summary)}</p>

    ${concept.terminology?.length ? `
    <div class="card terminology-card">
      <h3>Terminology</h3>
      <dl class="terminology-list">
        ${concept.terminology.map((t) => `
          <dt>${esc(t.term)}</dt>
          <dd>${esc(t.definition)}</dd>
        `).join("")}
      </dl>
    </div>` : ""}

    <div class="card amber">
      <h3>💡 Frontend perspective</h3>
      <p style="font-size:0.9rem">${esc(concept.frontendAnalogy)}</p>
    </div>

    <h3 style="font-weight:600;margin-bottom:0.75rem">Key points</h3>
    <ul class="key-points">
      ${concept.keyPoints.map((p) => `<li>${esc(p)}</li>`).join("")}
    </ul>

    <div class="card">
      <h3>${esc(concept.example.title)}</h3>
      <pre><code>${esc(concept.example.code)}</code></pre>
    </div>

    <div id="demo-slot"></div>
    <div id="quiz-slot"></div>
    <div id="notes-slot"></div>

    <a class="playlist-link" href="${PLAYLIST_URL}" target="_blank" rel="noopener">
      Watch in playlist: Backend from First Principles ↗
    </a>
  `;

  const demoSlot = content.querySelector("#demo-slot");
  if (concept.id === "http") demoSlot.appendChild(renderHttpPlayground());
  if (concept.id === "middleware") demoSlot.appendChild(renderMiddlewarePipeline());

  content.querySelector("#quiz-slot").appendChild(renderQuiz(concept.quiz));
  content.querySelector("#notes-slot").appendChild(
    renderNotesCard(concept.id, concept.title, () => renderNav())
  );
  updateCompleteBtn();
}

function updateCompleteBtn() {
  const btn = document.getElementById("btn-complete");
  const isDone = completed.has(activeId);
  btn.textContent = isDone ? "✓ Completed" : "Mark complete";
  btn.className = `btn btn-outline${isDone ? " done" : ""}`;
}

function render() {
  renderNav();
  renderProgress();
  renderContent();
}

document.getElementById("btn-complete").addEventListener("click", () => {
  if (completed.has(activeId)) completed.delete(activeId);
  else completed.add(activeId);
  saveProgress();
  renderNav();
  renderProgress();
  updateCompleteBtn();
});

document.getElementById("btn-next").addEventListener("click", () => {
  flushPendingNote();
  const i = backendConcepts.findIndex((c) => c.id === activeId);
  if (i < backendConcepts.length - 1) {
    activeId = backendConcepts[i + 1].id;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

function setupMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const mq = window.matchMedia("(min-width: 900px)");

  function setOpen(open) {
    sidebar.classList.toggle("is-open", open);
    overlay.classList.toggle("is-open", open);
    overlay.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close topics menu" : "Open topics menu");
    document.body.style.overflow = open ? "hidden" : "";
  }

  function closeNav() {
    if (!mq.matches) {
      setOpen(false);
    }
  }

  toggle.addEventListener("click", () => {
    setOpen(!sidebar.classList.contains("is-open"));
  });

  overlay.addEventListener("click", closeNav);

  mq.addEventListener("change", (e) => {
    if (e.matches) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeNav();
    }
  });

  document.getElementById("nav").addEventListener("click", (e) => {
    if (e.target.closest(".nav-btn")) {
      closeNav();
    }
  });
}

loadProgress();
loadNotes();
render();
setupBackupPanel({ onRestore: () => {
  loadProgress();
  loadNotes();
  render();
}});
setupMobileNav();
