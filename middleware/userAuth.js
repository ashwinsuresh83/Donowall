const jwt = require('jsonwebtoken');
const config = require('config');
const userToken = config.get('userToken');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) 
        return res.status(400).json({ msg: "No Token, authorization denied" }); // bad request

    try {
        const decoded = jwt.verify(token, config.get('SESSION_SECRET'));

        // if the type is present in the cookies but not equal to the cookie set during login/signup
        if (decoded.user.type !== userToken) 
            return res.status(401).json({ msg: "Not Authorized for this api" });
        
        req.user = decoded.user;
        next();
    } 
    catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}
