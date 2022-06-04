const fs = window.require('fs-extra'); // use window to avoid webpack

export const createNewSubtitleFile = (filename) => {
    fs.writeFile(filename, 'Learn Node FS module', function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
    });
};