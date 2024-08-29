const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve customer HTML
app.get('/customer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'customer.html'));
});

// Serve chef HTML
app.get('/chef', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chef.html'));
});

// Place order
app.post('/place-order', (req, res) => {
    const { items, total } = req.body;

    fs.readFile(path.join(__dirname, 'data', 'orders.json'), (err, data) => {
        if (err) throw err;
        const orders = JSON.parse(data);

        orders.push({ items, total });
        fs.writeFile(path.join(__dirname, 'data', 'orders.json'), JSON.stringify(orders), (err) => {
            if (err) throw err;
            res.json({ success: true });
        });
    });
});

// Get orders
app.get('/orders', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'orders.json'), (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

// Complete order
app.post('/complete-order', (req, res) => {
    const { index, total } = req.body;

    fs.readFile(path.join(__dirname, 'data', 'orders.json'), (err, data) => {
        if (err) throw err;
        const orders = JSON.parse(data);

        orders.splice(index, 1);
        fs.writeFile(path.join(__dirname, 'data', 'orders.json'), JSON.stringify(orders), (err) => {
            if (err) throw err;
        });
    });

    fs.readFile(path.join(__dirname, 'data', 'payout.json'), (err, data) => {
        if (err) throw err;
        const payout = JSON.parse(data);
        payout.payout += total;

        fs.writeFile(path.join(__dirname, 'data', 'payout.json'), JSON.stringify(payout), (err) => {
            if (err) throw err;
            res.json({ success: true });
        });
    });
});

// Get payout
app.get('/payout', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'payout.json'), (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
