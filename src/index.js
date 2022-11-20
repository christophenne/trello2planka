const { login, createImportProject, createBoard, createList, createCard } = require('./planka/api');
const { readAndValidateConfig } = require('./utils/config');
const { loadTrelloBoard, getLists, getCardsOfList } = require('./trello/export');

const main = async () => {
    try {
        const config = await readAndValidateConfig();
        const board = await loadTrelloBoard('sample-board-export.json');
        await login(config.PLANKA_API_BASE, config.PLANKA_IMPORT_USER, config.PLANKA_IMPORT_PASSWORD);
        const project = await createImportProject(config.IMPORT_PROJECT_NAME || 'Trello Import');
        const plankaBoard = await createBoard({
            name: board.name,
            projectId: project.id,
            type: 'kanban',
            position: 1
        });
        const lists = getLists();
        for(const [idx, list] of lists.entries()) {
            const plankaList = await createList({
                name: list.name,
                boardId: plankaBoard.id,
                position: list.pos
            });
            const cards = getCardsOfList(list.id);
            for(const card of cards) {
                await createCard({
                    boardId: plankaBoard.id,
                    listId: plankaList.id,
                    position: card.pos,
                    name: card.name,
                    description: card.desc || null
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
}

(async () => main())();
