const { login, createImportProject } = require('./planka/api');
const { readAndValidateConfig } = require('./utils/config');

const main = async () => {
    try {
        const config = await readAndValidateConfig();
        await login(config.PLANKA_API_BASE, config.PLANKA_IMPORT_USER, config.PLANKA_IMPORT_PASSWORD);
        await createImportProject(config.IMPORT_PROJECT_NAME || 'Trello Import');
    } catch (err) {
        console.error(err);
    }
}

(async () => main())();