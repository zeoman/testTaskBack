const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    // console.log(req.headers);

    if (req.method ==='OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' })
        }

        // Get userID + verify token from request
        req.user = jwt.verify(token, config.get('jwtSecret'));
        next();

    } catch (e) {
        return res.status(401).json({ message: 'Not authorized' })
    }
};
