const User = require('../models/UserModel');

const authMiddleware = async (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
};

module.exports = authMiddleware;
