const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware, generateToken } = require('../jwt');
 
const Person = require('../models/person_model');


router.post('/signup', async (req, res) => {
    try {

        const data = req.body;

        const newPerson = new Person(data);

        const savedPerson = await newPerson.save()
        console.log('Person saved successfully: ', savedPerson);

        const payload = {
            id: savedPerson.id,
            username: savedPerson.username,
        }

        const token = generateToken(payload)
        console.log('Token generated successfully: ', token);
        res.status(200).json({response: savedPerson, accessToken: token});
    } catch (err) {
        console.error('Error saving person: ', err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

/// login route
router.post('/login', async (req, res) => {
    try {

        const { username, password } = req.body;
        const user = await Person.findOne({ username: username});

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = {
            id: user.id,
            username: user.username,
        }

        const token = generateToken(payload);

        return res.status(200).json({ accessToken: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const person = await Person.find();
        console.log('Person retrieved successfully: ', person);
        res.status(200).json(person);
    } catch (err) {
        console.error('Error saving person: ', err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
});

// get person details
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const id = req.user.id;
        const user = await Person.findById(id);
        console.log('Person retrieved successfully: ', user);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/:workType', async (req, res) => {
    try {
        const workType = req.params.workType;

        if (workType == 'Chef' || workType == 'Waiter' || workType == 'Manager') {
            const person = await Person.find({ work: workType });
            console.log(`Person with work type ${workType} retrieved successfully: `, person);
            res.status(200).json(person);
        } else {
            res.status(404).json({ error: 'Invalid work type.' });
        }
    } catch (err) {
        console.error('Error retrieving person by work type: ', err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
});

router.put('/:id', async (req, res) => {
    try {
        const personId = req.params.id;
        const data = req.body;

        const response = await Person.findByIdAndUpdate(personId, data, {
            new: true,
            runValidators: true,
        })

        if (!response) {
            return res.status(404).json({ error: 'Person not found' });

        } else {
            console.log('Person updated successfully: ', response);
            res.status(200).json(response)
        }
    } catch (err) {
        console.error('Error retrieving person by id: ', err),
            res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const personId = req.params.id;

        const response = await Person.findByIdAndDelete(personId, {
            new: true,
            runValidators: true,
        });

        if (!response) {
            return res.status(404).json({ error: 'Person not found' });
        } else {
            console.log('Person deleted successfully');
            res.status(200).json({message: 'Person deleted successfully'});
        }
    } catch (err) {
        console.error('Error retrieving person by id: ', err),
            res.status(500).json({ error: 'Internal Server Error' })
    }
});

module.exports = router;