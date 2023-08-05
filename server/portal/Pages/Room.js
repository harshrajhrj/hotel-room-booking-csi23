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
        let checkout = null;
        // let checkout = await BookedGuest.findOne({guestId: req.user._id, roomId: req.params.id});
        let room = await fetch(`${process.env.SERVER_URL}/api/room/${req.params.id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        room = await room.json();
        const Page = new PageController('Room', { 'pictures': true });
        res.render('portal.ejs', { Page, guest, room, checkout });
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

        const room = await Room.findById(req.params.id);

        /**
         * Checking for pending payment of booked rooms.
         * If any found, then redirected to finish payment.
         */
        let checkout = await BookedGuest.find({ guestId: req.user._id });
        if (checkout.length)
            for (const check of checkout) {
                if (!check.receipt) {
                    req.flash('error', 'Please consider paying for the current booked room.');
                    return res.redirect(`/v1/room/checkout/pay/${check.roomId}`);
                }
            }

        /**
         * Check if the room is already booked or not
         */
        if (!room || room.booked) {
            req.flash('error', 'Room already booked!');
            return res.redirect(`/v1/hotel/${room.hotel}`);
        }

        /**
         * Create new booking
         */
        const NewBooking = new BookedGuest({
            guestId: req.user._id,
            roomId: req.params.id,
            bookedOn: new Date().toLocaleDateString('fr-CA'),
            checkIn: checkIn,
            checkOut: checkOut,
            stayingDays: days,
            price: room.price * days
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
        return res.redirect(`/v1/room/checkout/pay/${req.params.id}`);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: 'An error occurred'
        })
    }
});

/**
 * Cancel room booking
 * @param id - Room Object Id
 */
app.get('/checkout/cancel/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        room.booked = false;
        room.checkIn = null;
        room.checkout = null;
        room.bookedBy = null;
        await room.save();

        const hotel = await Hotel.findById(room.hotel);
        hotel.UnBookRoom();
        await hotel.save();

        await BookedGuest.findOneAndDelete({ guestId: req.user._id, roomId: req.params.id });
        req.flash('success', 'Room booking cancelled.');
        return res.redirect(`/v1/hotel/${room.hotel}`)
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: 'An error occurred'
        })
    }
});

/**
 * Checkout panel
 * @param id - Room Object Id
 */
app.get('/checkout/pay/:id', async (req, res) => {
    try {
        const guest = req.user || null;
        let room = await fetch(`${process.env.SERVER_URL}/api/room/${req.params.id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        room = await room.json();
        let checkout = await BookedGuest.findOne({ guestId: req.user._id, roomId: req.params.id });
        const Page = new PageController('Checkout', { 'pictures': true });
        res.render('portal.ejs', { Page, guest, room, checkout });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: 'An error occurred'
        })
    }
});

/**
 * Serve price
 * @param id - Room Object Id
 */
app.get('/checkout/price/:id', async (req, res) => {
    try {
        const Booked = await BookedGuest.findOne({ guestId: req.user._id, roomId: req.params.id }).populate('roomId');
        if (Booked.receipt)
            return res.status(200).json({
                message: 'N/A',
                hotel: Booked.roomId.hotel,
            });
        return res.status(200).json(Booked);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({
            message: 'Bad request'
        })
    }
});

/**
 * Final room checkout at payment gateway
 * @param id - Room Object Id
 */
app.post('/checkout/gateway/:id', async (req, res) => {
    try {
        const Booked = await BookedGuest.findOne({ guestId: req.user._id, roomId: req.params.id }).populate('roomId');
        Booked.receipt = Booked.roomId;
        await Booked.save().then((data) => console.log(data));

        res.status(200).json({
            message: 'Payment successful',
            hotel: Booked.roomId.hotel
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Bad request'
        })
    }
});

/**
 * 
 */
app.get('/checkout/payment/success/:id', async (req, res) => {
    try {
        req.flash('success', 'Room booked successfully.');
        return res.redirect(`/v1/hotel/${req.params.id}`);
    } catch (err) {
        console.log(err.message);
        res.json(500).json({
            message: 'Server error'
        })
    }
});

app.get('/checkout/payment/failed/:id', async (req, res) => {
    try {
        req.flash('error', 'Room already booked.');
        return res.redirect(`/v1/hotel/${req.params.id}`);
    } catch (err) {
        console.log(err.message);
    }
})
module.exports = app;