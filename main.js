import { db } from './firebase.js';
import { collection, getDocs, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const roomsGrid = document.getElementById('roomsGrid');

if (roomsGrid) {
  const q = query(collection(db, "rooms"), orderBy("price", "asc"));
  onSnapshot(q, (snapshot) => {
    let html = '';
    snapshot.forEach(doc => {
      const r = doc.data();
      const id = doc.id;
      html += `
        <div class="room-card">
          <img src="${r.image || 'https://via.placeholder.com/400x250?text=Room'}" alt="${r.name}">
          <h3>${r.name}</h3>
          <p class="small">${r.description || ''}</p>
          <p><strong>₦${Number(r.price).toLocaleString()}</strong> / night</p>
          <div class="card-row" style="justify-content:center;margin-top:8px">
            <button class="btn" ${r.available ? '' : 'disabled'} onclick="selectRoom('${id}')">
              ${r.available ? 'Book Now' : 'Unavailable'}
            </button>
          </div>
        </div>
      `;
    });
    roomsGrid.innerHTML = html;
  });
}

window.selectRoom = function(roomId) {
  localStorage.setItem('selectedRoomId', roomId);
  window.location.href = 'booking.html';
};