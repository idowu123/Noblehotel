import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const loginBtn = document.getElementById('loginBtn');
const errorP = document.getElementById('error');

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) return errorP.textContent = 'Enter email and password';

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Login successful → go to dashboard
    window.location.href = 'dashboard.html';
  } catch (err) {
    errorP.textContent = err.message;
  }
});