const express = require('express');
const router = express.Router();
const Bookmark = require('../models/bookmarkModel');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Update bookmark form
router.get('/update/:id', (req, res) => {
    const bookmarkId = req.params.id;
    Bookmark.findById(bookmarkId).lean()
        .then(bookmark => {
            if (!bookmark) {
                return res.status(404).send('Bookmark not found');
            }
            res.render('update', { bookmark: bookmark, error: null });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
});

// Update bookmark
router.post('/update/:id', (req, res) => {
    const bookmarkId = req.params.id;
    const { title, url } = req.body;
    Bookmark.findByIdAndUpdate(bookmarkId, { title: title, url: url }, { new: true, runValidators: true })
        .then(bookmark => {
            if (!bookmark) {
                return res.status(404).send('Bookmark not found');
            }
            res.redirect('/urllist');
        })
        .catch(error => {
            console.error(error);
            res.render('update', { bookmark: { _id: bookmarkId, title, url }, error: error.errors });
        });
});

// Delete bookmark confirmation
router.get('/delete/:id', (req, res) => {
    const bookmarkId = req.params.id;
    Bookmark.findById(bookmarkId).lean()
        .then(bookmark => {
            if (!bookmark) {
                return res.status(404).send('Bookmark not found');
            }
            res.render('delete', { bookmark: bookmark });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
});

// Delete bookmark
router.post('/delete/:id', (req, res) => {
    const bookmarkId = req.params.id;
    Bookmark.findByIdAndDelete(bookmarkId)
        .then(bookmark => {
            if (!bookmark) {
                return res.status(404).send('Bookmark not found');
            }
            res.redirect('/urllist');
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
});

module.exports = router;
