const fs = require('fs');

const filePath = './build/index.html';
const regex = /href="(\/[^\/]+)"/g;

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const replacedData = data.replace(regex, 'href="/assets$1"');

    fs.writeFile(filePath, replacedData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('File replaced successfully.');
    });
});
