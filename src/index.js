const { readAndValidateConfig } = require('./utils/config');
const { importTrelloBoard } = require('./planka/import');
const { getCommandLineParams } = require('./utils/cmd');

const main = async () => {
    try {
        const config = await readAndValidateConfig();
        const cmdParams = getCommandLineParams();
        await importTrelloBoard(config, cmdParams.trelloFile);
    } catch (err) {
        console.error(err);
    }
}

(async () => main())();
