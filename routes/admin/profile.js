const express = require('express');
const router = express.Router();
const config = require('config');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');
const adminAuth = require('../../middleware/adminAuth');
const mongoURI = config.get('DB');

// Create mongo connection
const conn = mongoose.createConnection(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser : true,
    useUnifiedTopology: true
});
let gfs;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('profile');
});

// creating the storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            {
                crypto.randomBytes(16, (err, buf) => {
                    if (err) {
                        return reject(err);
                    }
                    try {
                        const filename = `${buf.toString('hex')}${path.extname(file.originalname)}`;
                        const fileinfo = {
                            filename,
                            bucketName: 'profile'
                        };
                        resolve(fileinfo);   
                    } 
                    catch (err) {
                        return reject(err.message);
                    }
                })
            }
        })
    } 
})

const upload = multer({ storage });

// uploading the profile photo 
router.post('/photo', 
    [
        adminAuth,
        upload.single('file')
    ], 
    (req, res) => res.status(201).send(req.file)
)

// get the image
router.get('/photo', adminAuth, (req, res) => {
    console.log(gfs);
    // res.send(req.query.name)
    gfs.files.findOne({ filename: req.query.name }, (err, file) => {

        if (err)
            return res.status(500).json({ err})

        // Check if file
        if (!file || file.length === 0) 
          return res.status(404).json({ err: 'No file exists'});
        
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    });
})

module.exports=router
