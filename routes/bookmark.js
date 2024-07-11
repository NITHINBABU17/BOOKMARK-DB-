const express = require('express');
const router = express.Router();
const Bookmark = require('../models/bookmarkModel');
const { validationResult, check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', (req, res) => {
    res.render('bookmark', { errors: [], message: null });
});

router.post('/createproduct', [
    check('title').notEmpty().withMessage('Title is required'),
    check('url').isURL().withMessage('URL is invalid')
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('bookmark', { errors: errors.array(), message: null });
    }

    const { title, url } = req.body;
    const newBookmark = new Bookmark({
        title,
        url,
        user: req.user._id  // Set the user from the authenticated user
    });

    newBookmark.save()
        .then(() => {
            res.render('bookmark', { errors: [], message: "Bookmark saved successfully!" });
        })
        .catch((error) => {
            if (error.message === 'You can only add up to 5 bookmarks.') {
                return res.render('bookmark', { errors: [], message: error.message });
            } else {
                console.error(error);
                res.render('bookmark', { errors: [], message: "Error saving bookmark." });
            }
        });
});

module.exports = router;
