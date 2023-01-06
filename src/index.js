import { readAndValidateConfig } from './utils/config.js';
import { importTrelloBoard } from './planka/import.js';
import { getTrelloFilename } from './utils/cmd.js';

const main = async () => {
    try {
        const config = await readAndValidateConfig();
        await importTrelloBoard(config, getTrelloFilename());
    } catch (err) {
        console.error(err);
    }
}

(async () => main())();
