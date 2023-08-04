const BookedGuest = require('../../model/BookedGuest');
const Hotel = require('../../model/Hotel');
const Room = require('../../model/Room');
const PageController = require('../pageController');
const app = require('express').Router();

/**
 * BASE URL
 * /v1/room/...
 */

/**
 * Render specific room
 * @param id - Room Object Id
 */
app.get('/:id', async (req, res) => {
    try {
        const guest = req.user || null;
        let room = await fetch(`${process.env.SERVER_URL}/api/room/${req.params.id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        room = await room.json();
        const Page = new PageController('Room', { 'pictures': true });
        res.render('portal.ejs', { Page, guest, room });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: 'An error occurred'
        })
    }
});

/**
 * Book a specific room
 * @param id - Room Object Id
 */
app.post('/checkout/:id', async (req, res) => {
    try {
        const { checkIn, checkOut, days } = req.body;
        console.log(req.body);
        return res.json('Fucked');

        const room = await Room.findById(req.params.id);

        /**
         * Check if the room is already booked or not
         */
        if (!room || room.booked) {
            req.flash('error', 'Room already booked!');
            return res.redirect(`/v1/hotel/${hotelId}`);
        }

        /**
         * Create new booking
         */
        const NewBooking = new BookedGuest({
            guestId: req.user._id,
            roomId: req.params.id,
            bookedOn: new Date().toISOString(),
            bookedFrom: checkIn,
            checkOut: checkOut
        });
        await NewBooking.save();

        /**
         * Update booking detail in room document
         */
        room.booked = true;
        room.checkIn = checkIn;
        room.checkOut = checkOut;
        room.bookedBy = NewBooking._id;
        await room.save();

        /**
         * Update available rooms in hotel document
         */
        const hotel = await Hotel.findById(room.hotel);
        hotel.BookRoom();
        await hotel.save();

        // redirect to payment
        res.redirect(`/v1/room/checkout/pay/${req.params.id}`);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: 'An error occurred'
        })
    }
});

app.get('/checkout/pay/id', async (req, res) => {
    try {

    } catch (err) {
        console.log(err.message);
    }
})

module.exports = app;