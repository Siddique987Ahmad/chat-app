const User = require('../models/User');

const createUser = async (req, res) => {
    const { name, role } = req.body;

    const user = new User({ name, role });
    await user.save();

    res.status(201).json({ message: 'User created', user });
};

module.exports = { createUser };
