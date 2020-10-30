const mongoose = require('mongoose');

const validateObjId = id => (req, res, next) => {

    if (!mongoose.Types.ObjectId.isValid(req.params[id])) 
        return res.status(400).json({ error: "Invalid Object Id" });
    
    next();
}

module.exports = validateObjId;
