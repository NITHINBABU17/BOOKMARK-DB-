const express = require('express');
const router = express.Router();
const Bookmark = require('../models/bookmarkModel');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', (req, res) => {
    const { page = 1, limit = 3 } = req.query;  // Default limit set to 3
    const userId = req.user._id;  // Assuming the user ID is available in req.user._id

    Bookmark.paginate({ user: userId }, { page: parseInt(page), limit: parseInt(limit) })
        .then(result => {
            res.render('urllist', { data: result.docs, pagination: result });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
});

module.exports = router;
