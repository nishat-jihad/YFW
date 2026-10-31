/* Notifications
   - the bell button (top left) turns notifications on or off
   - first time the app is opened each day: a greeting with today's first task
   - tick a task in Tracker: the next task (no greeting)
   - tick the last task of the day: congratulations and today's study time
   Messages follow the app language. A web page can only notify while it is open in the browser
   (it can be started with the PC, see the Startup folder), so nothing is sent while it is closed. */

const ntBn = () => S.set.lang == 'bn';
const ntT = (en, bn) => ntBn() ? bn : en;              // text in the current app language
const ntDigits = s => String(s).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);

/* 3h 20m   /   ৩ ঘণ্টা ২০ মিনিট */
function ntDur(sec) {
  const m = Math.round(sec / 60), h = Math.floor(m / 60), r = m % 60, p = [];
  if (ntBn()) {
    if (h) p.push(h + ' ঘণ্টা');
    if (r || !h) p.push(r + ' মিনিট');
    return ntDigits(p.join(' '));
  }
  if (h) p.push(h + 'h');
  if (r || !h) p.push(r + 'm');
  return p.join(' ');
}

const ntCan = () => typeof Notification != 'undefined' && Notification.permission == 'granted';
const ntOn = () => !!(S.nt && S.nt.on) && ntCan();

/* today's tasks in time order, and how a task is written in a message */
const ntTasks = () => S.tasks.filter(x => x.date == td()).sort((a, b) => (a.s || '') < (b.s || '') ? -1 : 1);
const ntLine = x => (x.sub ? x.sub + ' — ' : '') + x.title + (x.s && x.e ? ' · ' + fmt12(x.s) + ' – ' + fmt12(x.e) : '');

function ntSend(title, body, tag) {
  if (!ntOn()) return false;
  const opt = { body, tag, renotify: true, lang: ntBn() ? 'bn' : 'en' };
  const plain = () => { try { new Notification(title, opt); } catch (e) {} };
  try {
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) {
      navigator.serviceWorker.getRegistration()
        .then(r => r ? r.showNotification(title, opt) : plain())
        .catch(plain);
    } else plain();
    return true;
  } catch (e) { return false; }
}

/* ---------- the three messages ---------- */

/* first time the app is opened today */
function ntGreet() {
  if (!ntOn() || !S.nt.g || S.nt.last == td()) return;
  S.nt.last = td();
  save();
  const h = new Date().getHours();
  const hi = ntBn()
    ? (h < 12 ? 'শুভ সকাল' : h < 16 ? 'শুভ দুপুর' : h < 18 ? 'শুভ বিকেল' : 'শুভ সন্ধ্যা')
    : (h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
  const name = (S.set.name || '').trim().split(/\s+/)[0];
  const tasks = ntTasks(), left = tasks.filter(x => !x.done);
  const body = !tasks.length
    ? ntT('No tasks are planned for today. Add some in Tracker.', 'আজকের জন্য কোনো টাস্ক নেই। Tracker-এ টাস্ক যোগ করো।')
    : !left.length
      ? ntT("All of today's tasks are already done.", 'আজকের সব টাস্ক আগেই শেষ হয়ে গেছে।')
      : ntT("Today's first task: ", 'আজকের প্রথম টাস্ক: ') + ntLine(left[0]);
  ntSend(hi + (name ? ', ' + name : '') + '!', body, 'yf-greet');
}

/* a task was just ticked as done in Tracker */
function ntAfterDone(x) {
  if (!ntOn() || x.date != td()) return;
  const left = ntTasks().filter(t => !t.done);
  if (left.length) {
    if (S.nt.n) ntSend(ntT('Next task', 'পরের টাস্ক'), ntLine(left[0]), 'yf-next');
    return;
  }
  if (!S.nt.d) return;
  const all = tot(td()), cls = tot(td(), 'class');
  const detail = cls ? ntT(' (self study ' + ntDur(all - cls) + ', class ' + ntDur(cls) + ')',
                           ' (নিজে পড়া ' + ntDur(all - cls) + ', ক্লাস ' + ntDur(cls) + ')') : '';
  ntSend(ntT('Congratulations!', 'অভিনন্দন!'),
    ntT("You finished all of today's tasks. Net study time today: ", 'আজকের সব টাস্ক শেষ করেছ। আজ মোট পড়েছ: ') + ntDur(all) + detail,
    'yf-done');
}

/* ---------- bell button, switch and settings ---------- */

function ntBell() {
  let b = $('#ntb');
  if (!b) {
    b = document.createElement('button');
    b.id = 'ntb';
    b.onclick = () => NT.bell();
    document.body.appendChild(b);
  }
  const on = ntOn();
  b.className = 'ntb' + (on ? ' on' : '');
  b.title = on ? ntT('Notifications are on (click to turn off)', 'নোটিফিকেশন চালু (বন্ধ করতে ক্লিক করো)')
               : ntT('Notifications are off (click to turn on)', 'নোটিফিকেশন বন্ধ (চালু করতে ক্লিক করো)');
  b.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 17v-6a6 6 0 0 1 12 0v6l2 2H4z"/><path d="M10 21a2 2 0 0 0 4 0"/>' +
    (on ? '' : '<path d="M4 4l16 16"/>') + '</svg>';
}

const NT = {
  bell() { NT.toggle(!ntOn()); },

  async toggle(on) {
    if (!on) {
      S.nt.on = 0; save(); ntBell();
      toast('Notifications are off');
    } else if (typeof Notification == 'undefined') {
      S.nt.on = 0; save(); ntBell();
      toast('This browser does not support notifications');
    } else {
      let p = Notification.permission;
      if (p == 'default') p = await Notification.requestPermission();
      if (p == 'granted') { S.nt.on = 1; save(); ntBell(); toast('Notifications are on'); }
      else { S.nt.on = 0; save(); ntBell(); toast('Notifications are blocked. Allow them for this site in the browser settings.'); }
    }
    if (R == 'settings') render();
  },

  set(k, v) { S.nt[k] = v ? 1 : 0; save(); },

  test() {
    if (!ntOn()) return toast('Turn notifications on first');
    ntSend(ntT('Notifications are working', 'নোটিফিকেশন ঠিকমতো কাজ করছে'), ntT('This is a test from Your Future.', 'এটা Your Future-এর একটা পরীক্ষা।'), 'yf-test');
    toast('Test sent');
  }
};

/* the Settings card */
function ntCard() {
  const c = S.nt, blocked = typeof Notification != 'undefined' && Notification.permission == 'denied';
  const box = (k, label) => `<label class=pr><input type=checkbox ${c[k] ? 'checked' : ''} onchange="NT.set('${k}',this.checked)">${label}</label>`;
  return card('Notifications', 'Shown while the app is open in the browser. Language follows the app language.',
    (blocked ? '<div class=warn>Notifications are blocked for this site in the browser. Allow them in the site settings, then turn them on here.</div>' : '') +
    `<label class=pr><input type=checkbox ${ntOn() ? 'checked' : ''} onchange="NT.toggle(this.checked)">Notifications on</label>` +
    box('g', "Morning greeting with today's first task") +
    box('n', 'Tell me the next task when I finish one') +
    box('d', "Congratulations and today's study time when all tasks are done") +
    '<div class=row style="margin-top:6px"><button onclick="NT.test()">Send a test notification</button></div>');
}

/* ---------- when it runs ---------- */

const ntWait = setInterval(() => {              // wait until the saved data is loaded
  if (!ready) return;
  clearInterval(ntWait);
  ntBell();
  ntGreet();
}, 300);

document.addEventListener('visibilitychange', () => {   // the person is back, e.g. the PC woke up
  if (!document.hidden && ready) { ntBell(); ntGreet(); }
});
