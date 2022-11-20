const { readAndValidateConfig } = require('./utils/config');
const { importTrelloBoard } = require('./planka/import');
const { getTrelloFilename } = require('./utils/cmd');

const main = async () => {
    try {
        const config = await readAndValidateConfig();
        await importTrelloBoard(config, getTrelloFilename());
    } catch (err) {
        console.error(err);
    }
}

(async () => main())();
