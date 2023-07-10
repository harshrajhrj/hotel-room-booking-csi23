const express = require('express');
const ConnectDB = require('./ConnectDB');
ConnectDB();
const app = express();

app.listen(3000, () => {console.log('HotelRoomSystem Server is live')});