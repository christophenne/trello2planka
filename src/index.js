const { readAndValidateConfig } = require('./utils/config');
const { importTrelloBoard } = require('./planka/import');

const main = async () => {
    try {
        const config = await readAndValidateConfig();
        // TODO read trello board file from cmd arguments here
        await importTrelloBoard(config, 'sample-board-export.json');
    } catch (err) {
        console.error(err);
    }
}

(async () => main())();
