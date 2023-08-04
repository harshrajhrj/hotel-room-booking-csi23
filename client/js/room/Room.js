const CheckIn = document.getElementById('checkIn');
const CheckOut = document.getElementById('checkOut');
const Price = document.querySelector('.h-room-price span:nth-child(2)');
const TotalPrice = document.querySelector('.h-room-total-price span:nth-child(2)');
const StayingDays = document.querySelector('.h-room-days span:nth-child(2)');
const StayingDaysInput = document.getElementById('days');

CheckOut.addEventListener('change', (e) => {
    e.preventDefault();
    const date1 = new Date(CheckIn.value);
    const date2 = new Date(CheckOut.value);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const total = diffDays * parseInt(Price.innerHTML.split('$')[1], 10);
    StayingDays.innerHTML = `${diffDays} days`;
    StayingDaysInput.value = diffDays;
    TotalPrice.innerHTML = `$${total}`;
});