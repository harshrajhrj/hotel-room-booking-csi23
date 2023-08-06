# hotel-room-booking-csi23
This project is about the design and development of Hotel Room Booking website.
## CSS and Component Styling
### Color combo for the application UI
* Color combination taken from MuffinGroup<sup>[Link](https://muffingroup.com/blog/yellow-color-palette/)</sup>
```scss
$smalt-blue: #567d92;
$casper: #a9c5d3;
$pirate-gold: #b08902;
$teak: #b0a16b;
$candlelight: #fdd719;
$tuatara: #2b2a28;
$vis-vis: #ffec9f;
$vis-vis-2: #fcf2cc;
```
### Box shadow
* https://getcssscan.com/css-box-shadow-examples (#18)
### Carousel card slider
**References**
* [Responsive card slider](https://youtu.be/qOO6lVMhmGc)<sup>[Code](https://www.codingnepalweb.com/responsive-card-slider-javascript/)</sup>
* [Owl carousel](https://youtu.be/BKKcGb80MOs)<sup>[Code](https://www.codingnepalweb.com/create-sliding-card-html-css-javascript/)</sup>
* [Our team section carousel](https://youtu.be/k-Od6skhZfo)<sup>[Code](https://github.com/devmode-on/Card-Slider)</sup>
### Swiperjs
* https://swiperjs.com
## Payment gateway
### Google Pay
* https://youtube.com/playlist?list=PLOU2XLYxmsILkNW9d1Jw9rHLAEORuuS-9
* https://pay.google.com/business/console/?utm_source=yt-metadata&utm_medium=video&utm_campaign=integration
### Google Pay API Reference
* https://developers.google.com/pay/api/web/overview
* https://developers.google.com/pay/api/web/reference/client
* [Demos](https://developers.google.com/pay/api/web/guides/resources/demos)
### Payment Processor
* https://razorpay.com/integrations/
## Storage
* MongoDB
### MongoDB File Storage - GridFS
* GridFS<sup>[Link](https://www.mongodb.com/docs/drivers/node/current/fundamentals/gridfs/#overview)</sup>
* https://github.com/aheckmann/gridfs-stream
### File storage middleware
* Multer<sup>[Link](https://expressjs.com/en/resources/middleware/multer.html)</sup>
```javascript
npm install --save multer
```
* Multer GridFS Storage<sup>[Link](https://github.com/devconcept/multer-gridfs-storage)</sup>
```javascript
npm install --save multer-gridfs-storage
```
### Flash messages
* Store flash messages in session<sup>[Link](https://github.com/jaredhanson/connect-flash)</sup>
```javascript
npm install connect-flash
```
### Express session
* Creates a session and stores session data at server-side, be it a database storage or default session storage `MemoryStore`(not preferred)<sup>[Link](https://expressjs.com/en/resources/middleware/session.html)</sup>
```javascript
npm install express-session
```
### Mongo storage for express session
* Create a mongo storage to store express session<sup>[Link](https://github.com/jdesboeufs/connect-mongo)</sup>
```javascript
npm install connect-mongo
```
## Server setup
### MongoDB database tools
* https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
* https://www.mongodb.com/docs/database-tools/
### HTTP Status Codes
* Frequent HTTP Status Codes used<sup>[Link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses)</sup>
## Troubleshooting-Debugging
### Redirect to previous page after login
* https://stackoverflow.com/questions/13335881/redirecting-to-previous-page-after-authentication-in-node-js-using-passport-js
## Things to do
* Migrate current local db to virtual machine
* Change redirect uri on cloud.google.com and .env
* Allow dynamic booking, that
    * booking in advance.
    * if already booked, then look for the other dates for that particular room.
    * room - addOns
    * add to card functionality
* To do
    * Show bookings
    * Navigation responsive