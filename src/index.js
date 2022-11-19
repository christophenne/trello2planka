const { login, createImportProject, createBoard } = require('./planka/api');
const { readAndValidateConfig } = require('./utils/config');
const { loadTrelloExport, getBoards } = require('./trello/export');

const main = async () => {
    try {
        const config = await readAndValidateConfig();
        await loadTrelloExport(config.TRELLO_JSON_FILE);
        await login(config.PLANKA_API_BASE, config.PLANKA_IMPORT_USER, config.PLANKA_IMPORT_PASSWORD);
        const project = await createImportProject(config.IMPORT_PROJECT_NAME || 'Trello Import');
        const boards = getBoards();
        for(const [idx, board] of boards.entries()) {
            await createBoard({
                ...board,
                projectId: project.id,
                type: 'kanban',
                position: idx + 1
            });
        }
    } catch (err) {
        console.error(err);
    }
}

(async () => main())();