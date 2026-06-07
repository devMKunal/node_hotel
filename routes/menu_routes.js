const express = require('express');
const router = express.Router();

const MenuItem = require('../models/menu_model');

router.post('/', async (req, res) => {
    try {
        const data = req.body;

        const newMenuItem = new MenuItem(data);

        const response = await newMenuItem.save();
        console.log('Menu item saved successfully: ', response);
        res.status(200).json(response);
    } catch (err) {
        console.error('Error saving menu item: ', err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        console.log('Menu items retrieved successfully: ', menuItems);
        res.status(200).json(menuItems);
    } catch (err) {
        console.error('Error retrieving menu items: ', err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
});

router.get('/:taste', async (req, res) => {
    try {
        const taste = req.params.taste;
        if (taste == 'Spicy' || taste == 'Sweet' || taste == 'Sour' || taste == 'Bitter' || taste == 'Salty') {
            const menuItems = await MenuItem.find({ taste: taste });
            console.log(`Menu items with taste ${taste} retrieved successfully: `, menuItems);
            res.status(200).json(menuItems);
        } else {
            res.status(404).json({ error: 'Invalid taste type.' });
        }
    } catch (err) {
        console.log('Error retrieving menu items by taste: ', err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
});

router.put('/:id', async (req, res) => {
    try {
        const menuItemId = req.params.id;
        const data = req.body;

        const response = await MenuItem.findByIdAndUpdate(menuItemId, data, {
            new: true,
            runValidators: true
        })

        if (!response) {
            console.log('Menu item not found');
            return res.status(404).json({ error: 'Menu item not found' });
        }

        console.log('Menu item updated successfully');
        res.status(200).json(response);
    } catch (err) {
        console.error('Error retrieving menu item by id: ', err),
            res.status(500).json({ error: 'Internal Server Error' })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const menuItemId = req.params.id;
        const response = await MenuItem.findByIdAndDelete(menuItemId, {
            new: true,
            runValidators: true,
        });

        if (!response) {
            console.log('Menu item not found');
            return res.status(404).json({ error: 'Menu item not found' });
        }

        console.log('Menu item deleted successfully');
        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (err) {
        console.error('Error retrieving menu item by id: ', err),
            res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = router;