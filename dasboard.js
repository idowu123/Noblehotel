import { auth, db } from './firebase.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { collection, getDocs, updateDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const logoutBtn = document.getElementById('logoutBtn');
const tableBody = document.querySelector('#bookingsTable tbody');

// Check if admin is logged in
onAuthStateChanged(auth, user => {
  if (!user) window.location.href = 'admin.html'; // redirect to login if not logged in
});

// Logout
logoutBtn.addEventListener('click', () => {
  signOut(auth).then(() => window.location.href = 'admin.html');
});

// Load bookings
const bookingsCol = collection(db, 'bookings');
onSnapshot(bookingsCol, snapshot => {
  let html = '';
  snapshot.forEach(docSnap => {
    const b = docSnap.data();
    html += `
      <tr>
        <td>${b.roomName}</td>
        <td>${b.customerName}</td>
        <td>${b.email}</td>
        <td>${b.phone}</td>
        <td>${b.checkin}</td>
        <td>${b.checkout}</td>
        <td>₦${Number(b.price).toLocaleString()}</td>
        <td>${b.status}</td>
        <td>
          <button onclick="toggleRoom('${b.roomId}')">Toggle Availability</button>
        </td>
      </tr>
    `;
  });
  tableBody.innerHTML = html;
});

// Toggle room availability
window.toggleRoom = async function(roomId) {
  const roomRef = doc(db, 'rooms', roomId);
  const roomSnap = await getDocs(collection(db, 'rooms'));
  const roomDocSnap = await getDoc(roomRef);
  if (!roomDocSnap.exists()) return alert('Room not found');
  const current = roomDocSnap.data().available;
  await updateDoc(roomRef, { available: !current });
  alert(`Room availability updated: ${!current ? 'Available' : 'Unavailable'}`);
};5