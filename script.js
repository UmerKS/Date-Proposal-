/* ── State ── */
let selectedTime   = '';
let selectedMovies = [];
let selectedDate   = null;
let calYear, calMonth;

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

/* ── Page Navigation ── */
function goToPage(n) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page' + n).classList.add('active');

  if (n === 2) {
    confetti({ particleCount: 200, spread: 110, origin: { y: 0.6 } });
  }

  if (n === 6) {
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('s-date').textContent  = selectedDate.toLocaleDateString('en-US', opts);
    document.getElementById('s-time').textContent  = 'at ' + selectedTime;
    document.getElementById('s-movie').textContent = selectedMovies.join(', ') || 'Surprise!';
    confetti({ particleCount: 260, spread: 120, origin: { y: 0.65 } });
  }
}

/* ── No Button Escape ── */
const noBtn = document.getElementById('no-btn');
noBtn.addEventListener('mouseenter', () => {
  const card = noBtn.closest('.page');
  const maxX  = card.offsetWidth  - noBtn.offsetWidth  - 16;
  const maxY  = card.offsetHeight - noBtn.offsetHeight - 16;
  noBtn.style.left = Math.max(0, Math.random() * maxX) + 'px';
  noBtn.style.top  = Math.max(0, Math.random() * maxY) + 'px';
});

/* ── Calendar ── */
function initCal() {
  const now  = new Date();
  calYear    = now.getFullYear();
  calMonth   = now.getMonth();
  renderCal();
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0;  calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCal();
}

function renderCal() {
  document.getElementById('cal-title').textContent = MONTHS[calMonth] + ' ' + calYear;

  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';

  DAYS.forEach(d => {
    const el = document.createElement('div');
    el.className   = 'cal-day-label';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today       = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const el       = document.createElement('div');
    el.className   = 'cal-day';
    el.textContent = d;

    const thisDate = new Date(calYear, calMonth, d);

    if (thisDate < today) {
      el.classList.add('past');
    } else {
      if (thisDate.getTime() === today.getTime()) el.classList.add('today');
      if (selectedDate && selectedDate.getTime() === thisDate.getTime()) el.classList.add('selected');
      el.onclick = () => selectDate(thisDate);
    }

    grid.appendChild(el);
  }
}

function selectDate(date) {
  selectedDate = date;
  renderCal();
  document.getElementById('date-next').classList.remove('btn-disabled');
}

/* ── Time Selection ── */
function selectTime(el, t) {
  document.querySelectorAll('.time-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedTime = t;
  document.getElementById('time-next').classList.remove('btn-disabled');
}

/* ── Movie Selection ── */
function toggleMovie(el, name) {
  el.classList.toggle('selected');

  if (selectedMovies.includes(name)) {
    selectedMovies = selectedMovies.filter(m => m !== name);
  } else {
    selectedMovies.push(name);
  }

  const btn = document.getElementById('movie-next');
  if (selectedMovies.length > 0) btn.classList.remove('btn-disabled');
  else btn.classList.add('btn-disabled');
}

/* ── Copy Plan ── */
function copyPlan() {
  const opts    = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = selectedDate ? selectedDate.toLocaleDateString('en-US', opts) : '';
  const txt     = `🎬 Movie Night Plan!\n📅 Date: ${dateStr}\n🕐 Time: ${selectedTime}\n🎥 Movie: ${selectedMovies.join(', ')}\n\nSee you then! ❤️`;

  navigator.clipboard.writeText(txt).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = '✅ Copied! Go text me!';
    setTimeout(() => btn.textContent = '📋 Copy plan & text me', 2500);
  }).catch(() => alert(txt));
}

/* ── Floating Hearts ── */
function createHeart() {
  const h       = document.createElement('div');
  h.className   = 'heart';
  h.innerHTML   = Math.random() > 0.5 ? '❤️' : '💗';
  h.style.left             = Math.random() * 100 + 'vw';
  h.style.fontSize         = (Math.random() * 20 + 12) + 'px';
  h.style.animationDuration = (Math.random() * 3 + 4) + 's';
  h.style.opacity          = Math.random() * 0.5 + 0.35;
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 8000);
}

setInterval(createHeart, 420);

/* ── Init ── */
initCal();
