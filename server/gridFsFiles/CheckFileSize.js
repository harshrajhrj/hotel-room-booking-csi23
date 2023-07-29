const FileHandler = require('./File');

/**
 * @var fileSizeLimit restricts file greater than 1 MB
 */
const fileSizeLimit = 1 * 1024 * 1024; //1 MB

/**
 * Middleware to check the permitted files to be considered(i.e. the file size within range)
 * and rejects the file having file size out of range.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Callback
 */
const checkFileSize = (req, res, next) => {

    // single file
    if(req.file) {
        if(req.file.size > fileSizeLimit) {
            FileHandler.delete(req.file.id);
            return res.status(400).json({ error: 'File size limit exceeded or no file uploaded.' });
        } else {
            next();
            return;
        }
    }

    // multiple files
    /**
     * Middleware req body variables for carrying the file status
     */
    req.body["uploaded"] = [];
    req.body["discarded"] = [];
    req.body["missing"] = [];

    /**
     * Checks if file exist or not
     */
    if (!req.files) {
        return res.status(400).json({ error: 'File size limit exceeded or no file uploaded.' });
    }

    /**
     * If file exists, then size checking for thumbnail file
     */
    if (req.files['thumbnail'])
        if (req.files['thumbnail'][0].size > fileSizeLimit) {
            FileHandler.delete(req.files['thumbnail'][0].id);
            req.body.discarded.push(['thumbnail', req.files['thumbnail'][0].originalname]);
        } else {
            req.body.uploaded.push(['thumbnail', req.files['thumbnail'][0].originalname, req.files['thumbnail'][0].id]);
        }
    /**
     * If thumbnail missing
     */
    else
        req.body.missing.push(['thumbnail', 'missing']);

    /**
     * If file exists, then size checking for thumbnail file
     */
    if (req.files['pictures']) {
        for (var i = 0; i < req.files['pictures'].length; i++) {
            if (req.files['pictures'][i].size > fileSizeLimit) {
                FileHandler.delete(req.files['pictures'][i].id);
                req.body.discarded.push(['pictures', req.files['pictures'][i].originalname]);
            } else {
                req.body.uploaded.push(['pictures', req.files['pictures'][i].originalname, req.files['pictures'][i].id]);
            }
        }
    }
    next();
};

module.exports = checkFileSize;