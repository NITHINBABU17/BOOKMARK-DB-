const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')// imported the mongoose-paginate


const listSchema = new mongoose.Schema({
 
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
listSchema.plugin(mongoosePaginate);
const list = mongoose.model('list', listSchema);

module.exports = list;