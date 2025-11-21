
import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const selectedRoomId = localStorage.getItem('selectedRoomId');
const roomInfoDiv = document.getElementById('roomInfo');
const toPaymentBtn = document.getElementById('toPaymentBtn');

if (!selectedRoomId) {
  roomInfoDiv.innerHTML = '<p class="small">No room selected. <a href="index.html">Choose a room</a></p>';
} else {
  const roomDoc = doc(db, "rooms", selectedRoomId);
  getDoc(roomDoc).then(docSnap => {
    if (!docSnap.exists()) return roomInfoDiv.innerHTML = '<p class="small">Room not found.</p>';
    const r = docSnap.data();
    roomInfoDiv.innerHTML = `
      <h3>${r.name}</h3>
      <p class="small">${r.description || ''}</p>
      <p><strong>₦${Number(r.price).toLocaleString()}</strong></p>
    `;
    if (!r.available) {
      toPaymentBtn.disabled = true;
      toPaymentBtn.textContent = 'Room Unavailable';
    }
  });
}

toPaymentBtn?.addEventListener('click', () => {
  const bookingTemp = {
    roomId: selectedRoomId,
    name: document.getElementById('fullName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    checkin: document.getElementById('checkin').value,
    checkout: document.getElementById('checkout').value,
  };

  if (!bookingTemp.name || !bookingTemp.email || !bookingTemp.phone) {
    alert('Fill name, email and phone.');
    return;
  }

  localStorage.setItem('bookingTemp', JSON.stringify(bookingTemp));
  window.location.href = 'payment.html';
});
5