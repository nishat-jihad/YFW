/* Auto track
   Sessions are planned ahead (subject, topic, start and end time). A web page cannot run while
   the app is closed or the device is off, so the plan is turned into real study records from
   the clock: whenever the app is open it saves every planned session whose time has passed.
   Only for self study and revision, never for class. */

let atab = 0;      // true while the Auto tab is open on the timer page
let aKey = '';     // id of the session shown as "running", so the panel refreshes when it changes

const A_EDIT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
const A_DEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

/* ---------- small helpers ---------- */

const aTime = ms => {
  const d = new Date(ms);
  return fmt12(pad(d.getHours()) + ':' + pad(d.getMinutes()));
};

const aDay = ms => {
  const d = ymd(new Date(ms));
  if (d == td()) return 'Today';
  if (d == ad(td(), 1)) return 'Tomorrow';
  if (d == ad(td(), -1)) return 'Yesterday';
  return new Date(ms).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
};

const aRange = a =>
  aDay(a.st) + ' · ' + aTime(a.st) + ' – ' + aTime(a.en) +
  (ymd(new Date(a.en)) != ymd(new Date(a.st)) ? ' (next day)' : '');

const aSorted = () => S.auto.items.slice().sort((x, y) => x.st - y.st);

/* the planned session that is running right now (only while Auto track is on) */
function autoNow() {
  if (!S.auto.on) return null;
  const n = Date.now();
  return aSorted().find(a => a.st <= n && n < a.en) || null;
}

/* ---------- recording ---------- */

/* writes a finished study record for [a.st, en]; returns true, false (too short) or 'locked' */
function autoSave(a, en) {
  const sec = Math.round((en - a.st) / 1000);
  const d = ymd(new Date(a.st));
  if (sec < 1) return false;
  if (S.lock[d]) return 'locked';
  const r = { id: uid(), st: a.st, en, sec, sub: a.sub, top: a.top, type: 'self', d, src: 'auto' };
  if (a.rv) r.rv = 1;
  S.ses.push(r);
  return true;
}

/* saves every planned session whose end time has passed */
function autoRun() {
  if (!ready || !S.auto.on) return;
  const n = Date.now();
  const due = aSorted().filter(a => a.en <= n);
  if (!due.length) return;

  let saved = 0, secs = 0, skipped = 0;
  due.forEach(a => {
    if (autoSave(a, a.en) === true) { saved++; secs += Math.round((a.en - a.st) / 1000); }
    else skipped++;
  });
  S.auto.items = S.auto.items.filter(a => a.en > n);
  save();

  let msg = saved == 1 && due.length == 1
    ? 'Auto session saved: ' + (due[0].sub || 'No subject') + ' · ' + fd(secs)
    : saved ? saved + ' auto sessions saved · ' + fd(secs) : '';
  if (skipped) msg += (msg ? ' · ' : '') + skipped + ' skipped (day is locked)';
  toast(msg);

  // refresh the page, unless the person is typing in a field
  const f = document.activeElement;
  const typing = f && /^(INPUT|SELECT|TEXTAREA)$/.test(f.tagName) && $('#main').contains(f);
  if (!typing) render();
}

/* ---------- planning form ---------- */

function aParse(d) {
  const st = new Date(d.date + 'T' + d.s).getTime();
  let en = new Date(d.date + 'T' + d.e).getTime();
  if (!(st > 0) || !(en > 0)) return null;
  if (en <= st) en += 864e5;          // an earlier end time means the next day
  return { st, en };
}

function aCheck(d, skipId) {
  const p = aParse(d);
  if (!p) return 'Choose a date, a start time and an end time';
  if (d.s == d.e) return 'Start and end time cannot be the same';
  if (S.lock[d.date]) return 'This day is locked';
  const x = S.auto.items.find(a => a.id != skipId && p.st < a.en && a.st < p.en);
  if (x) return 'Overlaps with ' + (x.sub || 'No subject') + ' (' + aTime(x.st) + ' – ' + aTime(x.en) + ')';
}

const AU = {
  open() { atab = 1; render(); },

  toggle() {
    S.auto.on = S.auto.on ? 0 : 1;
    save();
    toast(S.auto.on ? 'Auto track is on' : 'Auto track is off. Planned sessions are kept but not saved.');
    autoRun();            // a session whose time has already passed is recorded right away
    render();
  },

  add() { AU.form(); },
  edit(id) { AU.form(id); },

  form(id) {
    const cur = id && S.auto.items.find(a => a.id == id);
    const n = new Date();
    const next = new Date(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours() + 1).getTime();
    const hm = ms => { const d = new Date(ms); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
    const st0 = cur ? cur.st : next;
    const en0 = cur ? cur.en : next + 36e5;
    const subs = !cur || !cur.sub || S.subj.includes(cur.sub) ? S.subj : [...S.subj, cur.sub];

    form(cur ? 'Edit planned session' : 'Plan a session', [
      { k: 'date', l: 'Date', t: 'date', v: ymd(new Date(st0)) },
      { k: 's', l: 'Start time', t: 'time', v: hm(st0) },
      { k: 'e', l: 'End time', t: 'time', v: hm(en0) },
      { k: 'sub', l: 'Subject', v: cur ? cur.sub : (T().sub || ''), o: [['', 'No subject'], ...subs.map(s => [s, s])] },
      { k: 'top', l: 'Chapter / topic', v: cur ? cur.top : (T().top || ''), ph: 'Chapter or topic' },
      { k: 'kind', l: 'Type', v: cur && cur.rv ? 'rev' : 'self', o: [['self', 'Self study'], ['rev', 'Revision']] }
    ], d => {
      const p = aParse(d);
      const item = { id: cur ? cur.id : uid(), sub: d.sub, top: (d.top || '').trim(), rv: d.kind == 'rev' ? 1 : 0, st: p.st, en: p.en };
      if (cur) Object.assign(cur, item); else S.auto.items.push(item);
      save();
      const before = S.ses.length;
      autoRun();
      if (S.ses.length == before) {
        render();
        toast(S.auto.on ? 'Session planned' : 'Session planned. Turn Auto track on to record it.');
      }
    }, d => aCheck(d, cur && cur.id), cur ? 'Save' : 'Add session');
  },

  del(id) {
    ask('Delete this planned session? Nothing is saved for it.', () => {
      S.auto.items = S.auto.items.filter(a => a.id != id);
      save();
      render();
    }, 1, 'Delete');
  },

  /* ends the running planned session now and saves the time studied so far */
  finish() {
    const a = autoNow();
    if (!a) return;
    ask('Save ' + fd((Date.now() - a.st) / 1000) + ' of ' + esc(a.sub || 'No subject') + ' now? The rest of this planned session is dropped.', () => {
      const r = autoSave(a, Math.min(Date.now(), a.en));
      S.auto.items = S.auto.items.filter(x => x.id != a.id);
      save();
      render();
      toast(r === true ? 'Session saved' : r === 'locked' ? 'This day is locked' : 'Too short to save');
    }, 0, 'Save now');
  }
};

/* ---------- the Auto tab ---------- */

function autoPanel() {
  const on = S.auto.on, n = Date.now(), list = aSorted(), run = autoNow();
  aKey = run ? run.id : '';
  const kind = a => a.rv ? 'Revision' : 'Self study';

  const head = `<div class="row sb" style="align-items:center;gap:14px">
    <div style="flex:1;min-width:240px">
      <b>Auto track</b>
      <p class=mu style="margin:4px 0 0">Plan your self study or revision, then close the app or switch the device off. Planned sessions are saved from the clock whenever the app is open next.</p>
    </div>
    <button class="${on ? 'green' : 'p'}" onclick="AU.toggle()">${on ? '● On · turn off' : '○ Off · turn on'}</button>
  </div>`;

  const warn = !on && list.length
    ? '<div class=warn style="margin:14px 0 0">Auto track is off, so planned sessions are not being saved.</div>' : '';

  const note = '<p class=mu style="font-size:13px;margin:12px 0 0">Sessions are recorded from the times you plan, not by watching you study. Plan only what you will really study.</p>';

  const running = run ? `<div style="text-align:center;padding:18px 0 4px;border-top:1px solid var(--b);margin-top:16px">
    <div class=mu>Running now</div>
    <div class="big adig" data-st="${run.st}" style="font-size:min(14vw,56px)">${clk((n - run.st) / 1000)}</div>
    <div><b>${esc(run.sub || 'No subject')}</b>${run.top ? ' · ' + esc(run.top) : ''} <span class=mu>· ${kind(run)} · ends ${aTime(run.en)}</span></div>
    <div class=row style="justify-content:center;margin-top:12px"><button class=p onclick="AU.finish()">☐ Finish now &amp; save</button></div>
  </div>` : '';

  const rows = list.map(a => `<tr${run && run.id == a.id ? ' style="background:#f1f8f3"' : ''}>
    <td>${aRange(a)}</td><td>${esc(a.sub || '—')}</td><td>${esc(a.top || '—')}</td><td>${kind(a)}</td><td>${fd((a.en - a.st) / 1000)}</td>
    <td class=ea2><button class=ed onclick="AU.edit('${a.id}')" title="Edit" aria-label="Edit planned session">${A_EDIT}</button><button class=ed onclick="AU.del('${a.id}')" title="Delete" aria-label="Delete planned session">${A_DEL}</button></td>
  </tr>`).join('');

  const table = list.length
    ? `<div style="overflow-x:auto"><table class=study-log><thead><tr><th>When</th><th>Subject</th><th>Chapter</th><th>Type</th><th>Length</th><th class=ea2></th></tr></thead><tbody>${rows}</tbody></table></div>`
    : emp('No planned sessions', 'Plan a session, switch Auto track on, and it will be saved for you.');

  return head + warn + note + running +
    `<div class="row sb" style="margin:18px 0 10px"><b>Planned sessions</b><button class=green onclick="AU.add()">＋ Plan a session</button></div>` + table;
}

/* ---------- keeping it running while the app is open ---------- */

setInterval(() => {
  autoRun();
  document.querySelectorAll('.adig').forEach(e => e.textContent = clk((Date.now() - e.dataset.st) / 1000));
  // a planned session starts or ends while the Auto tab is open: refresh the panel
  if (ready && R == 'timer' && atab) {
    const k = (autoNow() || {}).id || '';
    if (k !== aKey) render();
  }
}, 1000);

document.addEventListener('visibilitychange', () => { if (!document.hidden) autoRun(); });
