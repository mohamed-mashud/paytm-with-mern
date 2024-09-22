const {JWT_SECRET} = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log(authHeader);
        return res.status(403).json({
            error: 'Authentication invalid'
        })
    }

    const token = authHeader.split(' ')[1];
    console.log(token);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
    if(decoded.userId) {
        req.userId = decoded.userId;
        next();
    } else {
        res.status(403).json({
            msg: "decoded userId mismatch"
        });
    }
}

module.exports = {
    authMiddleware
}