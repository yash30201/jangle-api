const jwt = require('jsonwebtoken');

const decode = async (req, res, next) => {
    try {
        if(!req.headers['authorization']) throw Error('No auth token provided in header');

        const authToken = req.headers.authorization.split(' ')[1];
        const payload = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
        req.userId = payload.userId;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = decode;