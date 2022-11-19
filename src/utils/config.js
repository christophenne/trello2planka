const fs = require('fs');

const readAndValidateConfig = async () => new Promise((resolve, reject) => {
    fs.readFile('config.json', (err, data) => {
        const config = data && JSON.parse(data);
        if (err || !config || !config.PLANKA_API_BASE || !config.PLANKA_IMPORT_USER 
            || !config.PLANKA_IMPORT_PASSWORD || !config.TRELLO_JSON_FILE) {
            err && console.error('Error reading config.json: ', err);
            reject(new Error('Please provide all config parameters in config.json: ' + 
                'PLANKA_API_BASE, PLANKA_IMPORT_USER, PLANKA_IMPORT_PASSWORD, TRELLO_JSON_FILE'));
            return;
        }
        resolve(config);
    });
});

exports.readAndValidateConfig = readAndValidateConfig;
