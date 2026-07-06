import { backendConcepts } from "./concepts.js?v=4";

const NOTES_STORAGE_KEY = "backend-study-notes";
const SYNC_CONFIG_KEY = "backend-study-notes-sync";
const PROGRESS_STORAGE_KEY = "backend-study-progress";
const BACKUP_VERSION = 1;
const GIST_FILENAME = "backend-study-backup.json";
const GIST_DESCRIPTION = "Backend Study Guide — notes & progress backup";

let notes = {};
let gistSyncTimer = null;

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

function getNote(conceptId) {
  return notes[conceptId] ?? "";
}

function setNote(conceptId, text) {
  notes[conceptId] = text;
  saveNotesLocal();
  scheduleGistSync();
}

function hasNote(conceptId) {
  return Boolean(notes[conceptId]?.trim());
}

function countNotes() {
  return Object.values(notes).filter((n) => n.trim()).length;
}

function getSyncConfig() {
  try {
    const raw = localStorage.getItem(SYNC_CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setSyncConfig(config) {
  if (!config) {
    localStorage.removeItem(SYNC_CONFIG_KEY);
    return;
  }
  localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(config));
}

function buildBackup() {
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

function exportNotionMarkdown() {
  const lines = [
    "# Backend Study Guide — Notes",
    "",
    `Exported: ${new Date().toLocaleString()}`,
    "",
    "Import in Notion: **Settings → Import → Markdown**",
    "",
  ];

  backendConcepts.forEach((concept) => {
    const text = getNote(concept.id).trim();
    if (!text) {
      return;
    }
    lines.push(`## ${concept.title}`);
    lines.push("");
    lines.push(`**Phase:** ${concept.phase}`);
    lines.push("");
    lines.push(text);
    lines.push("");
    lines.push("---");
    lines.push("");
  });

  if (lines.length <= 6) {
    lines.push("_No notes yet. Add notes on each topic first._");
  }

  downloadFile(
    `backend-study-notes-notion-${new Date().toISOString().slice(0, 10)}.md`,
    lines.join("\n"),
    "text/markdown"
  );
}

async function gistRequest(path, options = {}) {
  const config = getSyncConfig();
  if (!config?.token) {
    throw new Error("GitHub token not configured");
  }

  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${body}`);
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
}

async function createGist(backup) {
  const payload = await gistRequest("/gists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: GIST_DESCRIPTION,
      public: false,
      files: {
        [GIST_FILENAME]: { content: JSON.stringify(backup, null, 2) },
      },
    }),
  });
  return payload.id;
}

async function pushToGist() {
  const config = getSyncConfig();
  if (!config?.token) {
    return;
  }

  const backup = buildBackup();
  const content = JSON.stringify(backup, null, 2);

  if (config.gistId) {
    await gistRequest(`/gists/${config.gistId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        files: { [GIST_FILENAME]: { content } },
      }),
    });
    return;
  }

  const gistId = await createGist(backup);
  setSyncConfig({ ...config, gistId });
}

function scheduleGistSync() {
  const config = getSyncConfig();
  if (!config?.token) {
    return;
  }

  clearTimeout(gistSyncTimer);
  gistSyncTimer = setTimeout(() => {
    pushToGist().catch(() => {});
  }, 2000);
}

async function pullFromGist() {
  const config = getSyncConfig();
  if (!config?.token) {
    throw new Error("Add a GitHub token first");
  }

  if (!config.gistId) {
    return false;
  }

  const gist = await gistRequest(`/gists/${config.gistId}`);
  const file = gist.files?.[GIST_FILENAME];
  if (!file?.content) {
    return false;
  }

  applyBackup(JSON.parse(file.content));
  return true;
}

async function syncFromCloud() {
  const config = getSyncConfig();
  if (!config?.token) {
    throw new Error("Add a GitHub token first");
  }

  if (!config.gistId) {
    await pushToGist();
    return "created";
  }

  const pulled = await pullFromGist();
  return pulled ? "pulled" : "empty";
}

function renderNotesCard(conceptId, conceptTitle, onSave) {
  const card = document.createElement("div");
  card.className = "card notes-card";
  card.innerHTML = `
    <div class="notes-header">
      <h3>Your notes</h3>
      <span id="notes-status" class="notes-status" aria-live="polite">Saved on this device</span>
    </div>
    <label class="sr-only" for="concept-notes">Notes for ${conceptTitle}</label>
    <textarea id="concept-notes" class="notes-input" rows="5" placeholder="Jot down takeaways, questions, or links for this topic…"></textarea>
    <p class="notes-hint">Auto-saves locally. Use <strong>Sync & backup</strong> in the sidebar to back up or sync via GitHub Gist / Notion.</p>
  `;

  const textarea = card.querySelector("#concept-notes");
  const status = card.querySelector("#notes-status");
  textarea.value = getNote(conceptId);

  let saveTimer = null;
  textarea.addEventListener("input", () => {
    setNote(conceptId, textarea.value);
    status.textContent = "Saving…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      status.textContent = "Saved on this device";
      onSave?.();
    }, 400);
  });

  return card;
}

function setupSyncPanel({ onRestore }) {
  const statusEl = document.getElementById("sync-status");
  const tokenInput = document.getElementById("gist-token");
  const config = getSyncConfig();

  if (config?.token) {
    tokenInput.value = config.token;
  }
  if (config?.gistId) {
    statusEl.textContent = `Gist linked · ${countNotes()} notes backed up`;
  }

  document.getElementById("btn-export-json").addEventListener("click", () => {
    exportBackupJson();
    statusEl.textContent = "Backup downloaded";
  });

  document.getElementById("btn-export-notion").addEventListener("click", () => {
    exportNotionMarkdown();
    statusEl.textContent = "Notion markdown downloaded";
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

  document.getElementById("btn-save-gist-token").addEventListener("click", async () => {
    const token = tokenInput.value.trim();
    if (!token) {
      setSyncConfig(null);
      statusEl.textContent = "Cloud sync disabled";
      return;
    }

    setSyncConfig({ token, gistId: config?.gistId ?? null });
    statusEl.textContent = "Syncing…";

    try {
      const result = await syncFromCloud();
      if (result === "created") {
        statusEl.textContent = "Gist created — notes synced to GitHub";
      } else if (result === "pulled") {
        statusEl.textContent = "Restored from GitHub Gist";
        onRestore();
      } else {
        statusEl.textContent = "Gist linked — ready to sync";
      }
    } catch (err) {
      statusEl.textContent = err.message;
    }
  });

  document.getElementById("btn-sync-now").addEventListener("click", async () => {
    statusEl.textContent = "Syncing…";
    try {
      await pushToGist();
      statusEl.textContent = `Synced ${countNotes()} notes to GitHub`;
    } catch (err) {
      statusEl.textContent = err.message;
    }
  });

  document.getElementById("btn-pull-gist").addEventListener("click", async () => {
    statusEl.textContent = "Pulling…";
    try {
      const pulled = await pullFromGist();
      if (pulled) {
        statusEl.textContent = "Restored from GitHub Gist";
        onRestore();
      } else {
        statusEl.textContent = "Gist is empty";
      }
    } catch (err) {
      statusEl.textContent = err.message;
    }
  });
}

export {
  loadNotes,
  getNote,
  setNote,
  hasNote,
  countNotes,
  renderNotesCard,
  setupSyncPanel,
  pullFromGist,
  getSyncConfig,
};
