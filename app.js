const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// Route to display the form and existing messages (from username.txt)
app.use('/add-product', (req, res, next) => {
    // Read the existing data from "username.txt"
    fs.readFile('username.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            data = 'No chat exists';  // Default message if file does not exist or is empty
        }

        // Display the content of the file and the form
        res.send(`
            <p>${data}</p>
            <h2>Add a Product</h2>
            <form action="/product" method="POST">
                <input type="text" name="username" placeholder="Username" required>
                <input type="text" name="message" placeholder="Message" required>
                <button type="submit">Add Product</button>
            </form>
        `);
    });
});

// Route to handle form submission and save product data in "username.txt"
app.use('/product', (req, res, next) => {
    const { username, message } = req.body;

    // Read the existing content from "username.txt"
    fs.readFile('username.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            data = '';  // If the file doesn't exist, use an empty string
        }

        // Append the new product (username and message) to the data
        const newData = data + `${username}: ${message}\n`;

        // Write the updated data back to the "username.txt"
        fs.writeFile('username.txt', newData, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            // Redirect to the /add-product route to display the updated messages
            res.redirect('/add-product');
        });
    });
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
