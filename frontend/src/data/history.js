const KEY = "kmi-history";
const MAX = 8;

export function loadHistory() {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveToHistory(entry) {
  try {
    const list = [entry, ...loadHistory().filter((e) => e.id !== entry.id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(list));
    return list;
  } catch {
    return loadHistory();
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  return [];
}
