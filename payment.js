import { db } from './firebase.js';
import { doc, getDoc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const bookingTemp = JSON.parse(localStorage.getItem('bookingTemp'));
const summary = document.getElementById('summary');
const payBtn = document.getElementById('payBtn');

if (!bookingTemp) {
  summary.innerHTML = '<p class="small">No booking found.</p>';
  payBtn.disabled = true;
} else {
  const roomDoc = doc(db, "rooms", bookingTemp.roomId);
  getDoc(roomDoc).then(docSnap => {
    if (!docSnap.exists()) return summary.innerHTML = '<p class="small">Room not found.</p>';
    const r = docSnap.data();
    bookingTemp.price = r.price;
    bookingTemp.roomName = r.name;

    summary.innerHTML = `
      <p><strong>Room:</strong> ${r.name}</p>
      <p><strong>Price:</strong> ₦${r.price.toLocaleString()}</p>
      <p><strong>Name:</strong> ${bookingTemp.name}</p>
    `;
  });
}

payBtn?.addEventListener('click', () => {
  if (!bookingTemp || !bookingTemp.price) return alert('Booking info missing');

  const PAYSTACK_KEY = 'YOUR_PAYSTACK_PUBLIC_KEY';

  const handler = PaystackPop.setup({
    key: PAYSTACK_KEY,
    email: bookingTemp.email,
    amount: Math.round(bookingTemp.price) * 100,
    ref: 'HOTEL_' + Math.floor((Math.random() * 1000000000) + 1),
    callback: async function(response) {
      const bookingRecord = {
        roomId: bookingTemp.roomId,
        roomName: bookingTemp.roomName,
        customerName: bookingTemp.name,
        email: bookingTemp.email,
        phone: bookingTemp.phone,
        checkin: bookingTemp.checkin,
        checkout: bookingTemp.checkout,
        price: bookingTemp.price,
        paymentRef: response.reference,
        status: 'paid',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "bookings"), bookingRecord);
      await updateDoc(doc(db, "rooms", bookingTemp.roomId), { available: false });
      localStorage.setItem('lastBooking', JSON.stringify(bookingRecord));
      localStorage.removeItem('bookingTemp');
      window.location.href = 'success.html';
    },
    onClose: function() { alert('Payment closed.'); }
  });

  handler.openIframe();
});