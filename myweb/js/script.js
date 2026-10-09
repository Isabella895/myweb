// ---------- Feature 1: Theme switch (light/dark) ----------
const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

// Applies a theme, updates the button text and saves the choice.
function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
  try { localStorage.setItem('theme', theme); } catch (e) { /* storage unavailable */ }
}
let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) { /* ignore */ }
setTheme(savedTheme === 'dark' ? 'dark' : 'light');
themeBtn.addEventListener('click', function () {
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ---------- Feature 2: Mobile navigation ----------
const menuBtn = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

// Opens or closes the menu and keeps aria-expanded and the label in sync.
function setMenu(open) {
  navLinks.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? 'Close menu' : 'Menu';
}
menuBtn.addEventListener('click', function () {
  setMenu(!navLinks.classList.contains('open'));
});
navLinks.addEventListener('click', function (e) {
  if (e.target.tagName === 'A') { setMenu(false); }
});

// ---------- Feature 3: Study hours calculator ----------
const calcForm = document.getElementById('calc-form');
const calcResult = document.getElementById('calc-result');

// Checks the inputs and shows total weekly hours or an error message.
function calculateHours(event) {
  event.preventDefault();
  const hoursText = document.getElementById('hours').value.trim();
  const daysText = document.getElementById('days').value.trim();
  const hours = Number(hoursText);
  const days = Number(daysText);
  calcResult.style.color = '';

  let problem = '';
  if (hoursText === '' || daysText === '') {
    problem = 'Please fill in both fields.';
  } else if (isNaN(hours) || isNaN(days)) {
    problem = 'Please enter numbers only.';
  } else if (hours < 0 || hours > 24) {
    problem = 'Hours per day must be between 0 and 24.';
  } else if (!Number.isInteger(days) || days < 1 || days > 7) {
    problem = 'Days per week must be a whole number from 1 to 7.';
  }
  if (problem) {
    calcResult.textContent = problem;
    calcResult.style.color = getComputedStyle(root).getPropertyValue('--err');
    return;
  }
  calcResult.textContent = 'Total planned study time: ' + (hours * days) + ' hours per week.';
}
calcForm.addEventListener('submit', calculateHours);

// ---------- Compulsory: Contact form validation and preview ----------
const contactForm = document.getElementById('contact-form');
const preview = document.getElementById('preview');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Shows (or clears) an error message next to a field.
function setError(field, message) {
  document.getElementById(field + '-error').textContent = message;
}

// Validates name, email and message; shows a local preview if all are valid.
function validateContact(event) {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const topic = document.getElementById('topic').value;
  const message = document.getElementById('message').value.trim();
  let valid = true;

  setError('name', name === '' ? 'Please enter your name.' : '');
  setError('email', !emailPattern.test(email) ? 'Please enter a valid email, like name@example.com.' : '');
  setError('message', message === '' ? 'Please enter a message.' : '');
  if (name === '' || !emailPattern.test(email) || message === '') { valid = false; }

  preview.textContent = '';
  preview.classList.remove('show');
  if (!valid) { return; }

  const lines = [
    'Your input was validated. No message was sent.',
    'Name: ' + name,
    'Email: ' + email,
    'Topic: ' + topic,
    'Message: ' + message
  ];
  lines.forEach(function (text) {
    const p = document.createElement('p');
    p.textContent = text; // textContent keeps user text safe
    preview.appendChild(p);
  });
  preview.classList.add('show');
}
contactForm.addEventListener('submit', validateContact);
