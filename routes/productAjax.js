const express = require('express');
const router = express.Router();
const Bookmark = require('../models/bookmarkModel');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
// Route to retrieve all products (for testing, replace with authenticated route)
router.get('/retrieve_products', (req, res) => {
    res.json([]);
});

// Route to search products by title or URL for the authenticated user
router.get('/search_products', (req, res) => {
    const query = req.query.q || '';
    const userId = req.user._id; // Assuming the user's ID is available after authentication

    Bookmark.find({
        user: userId,
        $or: [
            { title :{ $regex: `^${query}`, $options: 'i' } },
            { url: { $regex: `^${query}`, $options: 'i' } }
        ]
    }, '-__v')
    .then(bookmarkList => {
        res.json(bookmarkList);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    });
});

// Route to search products by title or URL and render the result for the authenticated user
router.get('/search_product', (req, res) => {
    const query = req.query.q || '';
    const userId = req.user._id; // Assuming the user's ID is available after authentication

    Bookmark.find({
        user: userId,
        $or: [
            { title :{ $regex: `^${query}`, $options: 'i' } },
            { url: { $regex: `^${query}`, $options: 'i' } }
        ]
    }, '-__v')
    .then(bookmarkList => {
        res.render('productAjax', { products: bookmarkList });
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    });
});

module.exports = router;
