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
const { findById } = require('../../models/Admin');

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
                        return res.send(404).json({ err: "Error while deleting" })
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
router.put('/edit',adminAuth, async (req,res)=>{
    try{
        const admin= await Admin.findByIdAndUpdate(req.user.id,{$set:req.body},{new:true});
        res.json({admin})
    }
    catch(err){
        console.log(err)
        res.status(500).json({ err: "Server Error" });
    }
})
router.put('/editblood',adminAuth,async (req,res)=>{
    try{
        const admin=await Admin.findById(req.user.id)
        admin.blood_data=req.body.data
        console.log(req.body.data)
        await admin.save()
        res.json(admin.blood_data)
        
    }
    catch(err){
        console.log(err)
        res.status(500).json({ err: "Server Error" });
    }
})

module.exports = router
