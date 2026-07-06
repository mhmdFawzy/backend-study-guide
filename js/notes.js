const NOTES_STORAGE_KEY = "backend-study-notes";
const PROGRESS_STORAGE_KEY = "backend-study-progress";
const BACKUP_VERSION = 1;

let notes = {};
let pendingDraft = null;
let statusTimer = null;

function loadNotes() {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (raw) {
      notes = JSON.parse(raw);
    }
  } catch {
    notes = {};
  }
}

function saveNotesLocal() {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

function flushPendingNote() {
  if (!pendingDraft) {
    return;
  }
  notes[pendingDraft.conceptId] = pendingDraft.text;
  saveNotesLocal();
  pendingDraft = null;
}

function getNote(conceptId) {
  if (pendingDraft?.conceptId === conceptId) {
    return pendingDraft.text;
  }
  return notes[conceptId] ?? "";
}

function setNote(conceptId, text) {
  pendingDraft = { conceptId, text };
  notes[conceptId] = text;
  saveNotesLocal();
}

function hasNote(conceptId) {
  return Boolean(getNote(conceptId).trim());
}

function buildBackup() {
  flushPendingNote();

  let progress = [];
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (raw) {
      progress = JSON.parse(raw);
    }
  } catch {
    progress = [];
  }

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    progress,
    notes,
  };
}

function applyBackup(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid backup file");
  }

  if (data.notes && typeof data.notes === "object") {
    notes = data.notes;
    pendingDraft = null;
    saveNotesLocal();
  }

  if (Array.isArray(data.progress)) {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data.progress));
  }
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportBackupJson() {
  const backup = buildBackup();
  downloadFile(
    `backend-study-backup-${backup.exportedAt.slice(0, 10)}.json`,
    JSON.stringify(backup, null, 2),
    "application/json"
  );
}

function renderNotesCard(conceptId, conceptTitle, onSave) {
  const card = document.createElement("div");
  card.className = "card notes-card";
  card.innerHTML = `
    <div class="notes-header">
      <h3>Your notes</h3>
      <span id="notes-status" class="notes-status" aria-live="polite">Saved</span>
    </div>
    <label class="sr-only" for="concept-notes">Notes for ${conceptTitle}</label>
    <textarea id="concept-notes" class="notes-input" rows="5" placeholder="Jot down takeaways, questions, or links for this topic…"></textarea>
    <p class="notes-hint">Auto-saves in this browser on every keystroke. Use <strong>Backup</strong> in the sidebar to download or restore your notes.</p>
  `;

  const textarea = card.querySelector("#concept-notes");
  const status = card.querySelector("#notes-status");
  textarea.value = getNote(conceptId);

  textarea.addEventListener("input", () => {
    setNote(conceptId, textarea.value);
    status.textContent = "Saving…";
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      status.textContent = "Saved";
      onSave?.();
    }, 300);
  });

  return card;
}

function setupBackupPanel({ onRestore }) {
  const statusEl = document.getElementById("backup-status");

  document.getElementById("btn-export-json").addEventListener("click", () => {
    exportBackupJson();
    statusEl.textContent = "Backup downloaded";
  });

  document.getElementById("btn-import-json").addEventListener("click", () => {
    document.getElementById("import-file").click();
  });

  document.getElementById("import-file").addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      applyBackup(JSON.parse(text));
      statusEl.textContent = "Backup restored";
      onRestore();
    } catch {
      statusEl.textContent = "Could not read backup file";
    }
  });

  window.addEventListener("beforeunload", () => {
    flushPendingNote();
  });
}

export {
  loadNotes,
  getNote,
  setNote,
  hasNote,
  renderNotesCard,
  setupBackupPanel,
  flushPendingNote,
};
