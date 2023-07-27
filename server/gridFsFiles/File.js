const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

let hotelBucket;
mongoose.connection.on("connected", () => {
    var db = mongoose.connections[0].db;
    hotelBucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'hotelFiles'
    })
    console.log('HotelRoomSystem File storage engine is connected');
})

/**
 * @type Object | An instance of class `GridFsStorage` used to store a file using GridFS
 * @class GridFsStorage
 */
const hotelStorage = new GridFsStorage({
    url: process.env.DB_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
                filename: filename,
                bucketName: "hotelFiles"
            };
            resolve(fileInfo);
        });
    }
});

/**
 * Used to handle file upload from client form-data
 */
const upload = multer({
    hotelStorage
})

/**
 * Function to retrieve files
 * @param {*} req Express request
 * @param {*} res Express response
 */
function Retrieve(req, res) {
    const callback = (files) => {
        if (!files || files.length === 0) {
            return res.status(404)
                .json({
                    err: "no files exist"
                });
        }

        /**
         * The following header helps us to retrieve file with correct format.
         */
        res.setHeader("Content-Type", files[0].contentType);

        /**
         * The following header helps us to set the original filename(as saved) in the attachment.
         * @param {*} inline allow the file to be viewable on the browser
         * @param {*} attachment allow the file to be downloadable on the browser
         */
        res.setHeader("Content-Disposition", `inline; filename="${files[0].filename}"`);

        hotelBucket.openDownloadStream(new mongoose.Types.ObjectId(req.params.id))
            .pipe(res);
    }

    const file = hotelBucket
        .find({
            _id: new mongoose.Types.ObjectId(req.params.id)
        })
        .toArray();
    file.then(callback);
}

/**
 * Function to rename a file
 * @param {*} id Old file id
 * @param {*} NewName New file name
 */
function Rename(id, NewName) {
    const file = hotelBucket.rename(new mongoose.Types.ObjectId(id), NewName);
    return file;
}

/**
 * Function to delete a file
 * @param {*} id File id
 * @returns Object
 */
function Delete(id) {
    const file = hotelBucket.delete(new mongoose.Types.ObjectId(id));
    return file;
}

module.exports = { upload: upload, retrieve: Retrieve, rename: Rename, delete: Delete };