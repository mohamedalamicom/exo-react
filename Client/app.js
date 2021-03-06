const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const fs = require('fs')
const { body, validationResult } = require('express-validator')

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/customer', [
    // Validation with Express-Validator

    // First step
    body('firstname').isAlpha(),
    body('lastname').isAlpha(),
    body('title').isAlpha(),
    body('email').isEmail(),
    body('mobile').isMobilePhone(),

    // Second step
    body('country').isLength({ min: 3, max: 46 }),
    body('street').isLength({ min: 3, max: 255 }),
    body('city').isLength({ min: 3, max: 28 }),

    // Third step
    // Bank informations ?
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    res.sendStatus(200)
})

app.get('/countries/:keywords?', (req, res, next) => {
    // Retrieving keywords (optional) 
    let searchKeywords = req.params.keywords;

    // Reading from countries list JSON
    let data = fs.readFileSync('./countries.json');
    let countries = JSON.parse(data);

    if (searchKeywords) {
        let results = [];

        countries.forEach(country => {
            if (country.name.toUpperCase().includes(searchKeywords.toUpperCase()))
                results.push(country);
        })

        res.send(results);
    }

    res.send(countries);
})

app.get('/', (req, res) => {
    res.send('Exo-React\'s server is running');
})

app.listen(port, () => {
    console.log(`Exo-React's server is open at http://localhost:${port}`)
})