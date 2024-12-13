const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_your_secret_key'); // Use your own secret key
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/colorprediction', { useNewUrlParser: true, useUnifiedTopology: true });

// Routes

// User Signup
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, balance: 100 }); // Default balance for new user

    await user.save();
    res.status(201).send('User created');
});

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, 'secretkey');
    res.json({ token });
});

// Deposit Route
app.post('/deposit', async (req, res) => {
    const { token, amount } = req.body;
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findById(decoded.userId);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        payment_method: req.body.payment_method_id,
        confirmation_method: 'manual',
        confirm: true,
    });

    // Check payment status and update balance
    if (paymentIntent.status === 'succeeded') {
        user.balance += amount;
        await user.save();
        res.json({ message: 'Deposit successful', balance: user.balance });
    } else {
        res.status(400).send('Payment failed');
    }
});

// Withdraw Route (Simulated for this example)
app.post('/withdraw', async (req, res) => {
    const { token, amount } = req.body;
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findById(decoded.userId);

    if (user.balance < amount) {
        return res.status(400).send('Insufficient balance');
    }

    // Simulate a withdrawal - for this example, we will just reduce the balance
    user.balance -= amount;
    await user.save();
    res.json({ message: 'Withdrawal successful', balance: user.balance });
});

// Utility functions
function getRandomColor() {
    const colors = ['red', 'blue', 'green'];
    return colors[Math.floor(Math.random() * colors.length)];
}

app.listen(3000, () => console.log('Server running on port 3000'));
