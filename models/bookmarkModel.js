const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bookmarkSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

bookmarkSchema.pre('save', async function(next) {
    try {
        const bookmarkCount = await this.constructor.countDocuments({ user: this.user });

        if (bookmarkCount >= 5) {
            const error = new Error('You can only add up to 5 bookmarks.');
            throw error;
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }
});
bookmarkSchema.plugin(mongoosePaginate);
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
