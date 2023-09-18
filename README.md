[hotel-room-booking-csi23](https://bookaashiyana.onrender.com)
# Requirements
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
* Multer<sup>[Link](https://github.com/expressjs/multer)</sup>
* Multer-GridFS-Storage<sup>[Link](https://github.com/devconcept/multer-gridfs-storage)</sup>
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
### Certbot Certificate Issue
* https://eff-certbot.readthedocs.io/en/stable/index.html
### HTTP Status Codes
* Frequent HTTP Status Codes used<sup>[Link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses)</sup>
## Troubleshooting-Debugging
### Redirect to previous page after login
* [ ] https://stackoverflow.com/questions/13335881/redirecting-to-previous-page-after-authentication-in-node-js-using-passport-js
* [ ] Avoid creating sessions on page reload
## Things to do
* [ ] Allow dynamic booking, that
    * booking in advance.
    * if already booked, then look for the other dates for that particular room.
    * room - addOns
    * add to cart functionality
* [ ] Navigation
    * Navigation responsive
* [ ] Booking
    * Show bookings
* [ ] Checkout panel
    * If room booked but payment not done, then the guest will see the "Go to checkout"(checkout panel) in room page as well as the guest can also edit the date input until the payment has been done.
    * Prevent others to see the checkout panel, if the guest has already booked the room.
* [ ] Finish payment processing in backend
# Getting started
To start this application, you need to configure following things
1. Create OAuth2.0 client credentials on Google Cloud Console
2. Environment variables
3. Install the dependencies
4. Install MongoDB compass and complete the setup using MongoDB database tools
5. Create a database
## Environment variables
The following are the keys against which the values has to be put
```
DB_URL=<mongodb://127.0.0.1:27017/DATABASE_NAME>
CLIENT_ID=<OAUTH2.0_CLIENT_ID>
CLIENT_SECRET=<OAUTH2.0_CLIENT_SECRET>
CLIENT_REDIRECT=/auth/redirect/google
CLIENT_SUCCESS=/
SERVER_URL=https://<DOMAIN>
```
## Installing the dependencies
```javascript
npm install
```
## MongoDB server and database setup
Install the server
* https://www.mongodb.com/try/download/compass
* https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
Install database tools
* https://www.mongodb.com/docs/database-tools/
## Build and run
After all configurations have been completed, run the following command in the terminal making sure you're in root directory
```javascript
npm start
```