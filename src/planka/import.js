const { setupPlankaClient, createImportProject, createBoard, createList, createCard, createTask } = require('./client');
const { loadTrelloBoard, getBoardName, getTrelloLists, getTrelloCardsOfList, getAllTrelloCheckItemsOfCard } = require('../trello/export');
const { getImportProjectName } = require('../utils/cmd');

const importTrelloBoard = async (config, filename) => {
    await loadTrelloBoard(filename);
    await setupPlankaClient(config.PLANKA_API_BASE, config.PLANKA_IMPORT_USER, config.PLANKA_IMPORT_PASSWORD);
    const { plankaBoard } = await createProjectAndBoard(config);
    // TODO storeBoardMapping(trelloBoard, plankaBoard);

    for(const trelloList of getTrelloLists()) {
        const plankaList = await createList({
            name: trelloList.name,
            boardId: plankaBoard.id,
            position: trelloList.pos
        });
        // TODO storeListMapping(trelloList, plankaList);
        for(const trelloCard of getTrelloCardsOfList(trelloList.id)) {
            const plankaCard = await createCard({
                boardId: plankaBoard.id,
                listId: plankaList.id,
                position: trelloCard.pos,
                name: trelloCard.name,
                description: trelloCard.desc || null
            });
            // TODO storeCardMapping(trelloCard, plankaCard);

            // TODO find workaround for tasks/checklist mismapping
            for(const trelloCheckItem of getAllTrelloCheckItemsOfCard(trelloCard.id)) {
                await createTask({
                    cardId: plankaCard.id,
                    position: trelloCheckItem.pos,
                    name: trelloCheckItem.name,
                    isCompleted: trelloCheckItem.state === 'complete'
                });
            }

            // TODO labels

            // TODO attachments

            // TODO comments
        }
    }

}

async function createProjectAndBoard(config) {
    const project = await createImportProject(getImportProjectName() || 'Trello Import');
    const plankaBoard = await createBoard({
        name: getBoardName(),
        projectId: project.id,
        type: 'kanban',
        position: 1
    });
    return { project, plankaBoard };
}

exports.importTrelloBoard = importTrelloBoard;
