const {Router} = require('express');
const Transactions = require('../models/Transactions');
const auth = require('../middleware/auth.middleware');

const router = Router();


// /api/v1/dashboard

router.get('/', auth,
    async (req, res) => {
        try {
            const transactions = await Transactions.find({});

            res.json(transactions);
        } catch (e) {
            res.status(500).json({message: 'Something went wrong, try again'})
        }
    });

// /api/v1/dashboard/add-transactions
router.post(
    '/add-transactions',
    async (req, res) => {
        try {
            console.log(req.body);

            const data = req.body;

            const addTransactions = async () => {
                await data.forEach(async tr => {
                    let {id, date, country, city, transactions, amount} = tr;

                    const transactionsObject = new Transactions({
                        id, date, country, city, transactions, amount
                    });
                    await transactionsObject.save();
                });
            };
            addTransactions();

            res.status(201).json({message: 'Transactions created successfully'})

        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Something went wrong, try again'})
        }
    });

module.exports = router;
