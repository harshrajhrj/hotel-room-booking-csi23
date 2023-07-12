# hotel-room-booking-csi23
This project is about the design and development of Hotel Room Booking website.

## Color combo for the application UI
* Color combination taken from MuffinGroup<sup>[Link](https://muffingroup.com/blog/yellow-color-palette/)</sup>
```scss
$smalt-blue: #567d92;
$casper: #a9c5d3;
$pirate-gold: #b08902;
$teak: #b0a16b;
$candlelight: #fdd719;
$tuatara: #2b2a28;
$vis-vis: #ffec9f;
```

## Storage
* MongoDB
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