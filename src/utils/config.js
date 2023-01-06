import fs from 'fs';

export const readAndValidateConfig = async () => new Promise((resolve, reject) => {
    fs.readFile('config.json', (err, data) => {
        const config = data && JSON.parse(data);
        if (err || !config?.planka?.api || !config?.planka?.importUser || !config?.planka?.importPassword) {
            err && console.error('Error reading config.json: ', err);
            reject(new Error('Please provide all config parameters in config.json: ' + 
                'PLANKA_API_BASE, PLANKA_IMPORT_USER, PLANKA_IMPORT_PASSWORD'));
            return;
        }
        resolve(config);
    });
});
