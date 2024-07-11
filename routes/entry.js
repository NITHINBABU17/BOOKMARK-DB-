var express = require('express');
var router = express.Router();
const Medicine = require('../models/medicine');
const { validationResult, check } = require('express-validator');

router.get('/', function (req, res) {
    res.render('entry', { errors: [] }); // Pass an empty array for errors initially
});

router.post('/server', [
    check('date').custom((value) => {
        const inputDate = new Date(value);
        const currentDate = new Date();
        if (isNaN(inputDate.getTime())) {
          throw new Error('Invalid date format');
        }
        if (inputDate < currentDate) {
            throw new Error('Medicine expired'); // Throw error if the date is in the past
        }
        return true;
    })
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If there are validation errors, render the form again with the errors
        return res.render('entry', { errors: errors.array() });
    }

    const { medicine, price, date, description } = req.body;
    const newMedicine = new Medicine({
        medicine,
        price,
        date,
        description
    });
    newMedicine.save()
        .then(() => {
            res.render('formpost', { Message: "Data saved to medicine db" });
        })
        .catch((error) => {
            console.error(error);
            res.render('formpost', { Message: "Error saving data to medicine db" });
        });
});

module.exports = router;
