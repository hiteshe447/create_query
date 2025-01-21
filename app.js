const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('index', { formattedIds: null });
});

app.post('/process-ids', (req, res) => {
    const ids = req.body.ids || '';
    const idArray = ids.split('\n').map(id => id.trim()).filter(id => id);
    const formattedIds = idArray.map(id => `'${id}'`).join(', ');

    // Write to a file
    const outputFilePath = path.join(__dirname, 'public', 'output_ids.txt');
    fs.writeFileSync(outputFilePath, formattedIds);

    res.render('index', { formattedIds });
});

app.get('/download', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'output_ids.txt');
    res.download(filePath, 'output_ids.txt', (err) => {
        if (err) {
            console.error('Error downloading the file:', err);
            res.status(500).send('Error downloading the file');
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
