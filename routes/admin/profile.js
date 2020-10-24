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
const Admin = require('../../models/Admin');
const { check, validationResult } = require('express-validator');

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
    async (req, res) => {

        try {
            const admin = await Admin.findOne({ _id: req.user.id });
        
            // if profile picture is already present
            if (admin.image) {
                const img_id = admin.image;
                gfs.remove({ _id: img_id, root: 'profile' }, (err, _) => {
                    if (err)
                        return res.send(404).json({ err: "Error while deleting" });
                })
            }

            admin.image = req.file.id;
            await admin.save();
            res.status(201).send(req.file);   
        } 
        catch (err) {
            console.log(err.message);
            res.status(500).json({ err: "Server Error" });
        }
    }
)

// get the image
router.get('/photo', (req, res) => {
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

// edit the admin profile 
router.put('/edit', 
[
    adminAuth, 
    [
        check('name', 'Hospital name is required').not().isEmpty(),
        check('contact', 'Contact is required').not().isEmpty(),
        check('city', 'City is required').not().isEmpty(),
        check('state', 'State is required').not().isEmpty(),
        check('address', 'Address is required').not().isEmpty(),
        check('pincode', 'Pincode is required').not().isEmpty()
    ]
], 
async (req, res)=>{
    try {
        const errors = validationResult(req);
        // if the any of the field is missing
        if (!errors.isEmpty())
            return res.status(400).json({ error: errors.array() });

        const admin = await Admin.findByIdAndUpdate(
            req.user.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json({ admin });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err: "Server Error" });
    }
})

// edit the blood data
router.put('/editblood', adminAuth, async (req,res) => {
    try {
        const { data } = req.body;
        const admin = await Admin.findById(req.user.id);
        admin.blood_data = data;
        await admin.save();
        res.status(200).json({ blood_data: admin.blood_data });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err: "Server Error" });
    }
})

module.exports = router
