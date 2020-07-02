const {Router} = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();

// /api/v1/auth/register

router.post(
    '/register',
    [
        check('email', 'Invaild e-mail').normalizeEmail().isEmail(),
        check('password', 'Min is 6 characters')
            .isLength({ min: 6 })
    ],
    async (req, res) => {

    try {
        console.log(req.body);
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid registration data'
            })
        }
        const {email, password} = req.body;

        const candidate = await User.findOne({email});
        if (candidate) {
            return res.status(400).json({message: 'Email exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log(req.body);
        const user = new User({ email, password: hashedPassword });
        await user.save();

        res.status(201).json({message: 'User created successfully'})

    } catch (e) {
        res.status(500).json({message: 'Something went wrong, try again'})
    }
});

// /api/v1/auth/login
router.post(
    '/login',
    [
        check('email', 'Invalid e-mail').normalizeEmail().isEmail(),
        check('password', 'Field required').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid login data'
            })
        }
        const {email, password} = req.body;

        const user = await User.findOne({email: email});

        if (!user) {
            return res.status(400).json({message: 'User does not exists'})
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({message: 'Password is incorrect'})
        }

        const token =jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: config.get('TokenLifeTime') }
        );

        res.json({token, userId: user.id});

    } catch (e) {
        res.status(500).json({message: 'Something went wrong, try again'})
    }
});


module.exports = router;
