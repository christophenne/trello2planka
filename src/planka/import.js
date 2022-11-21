const { setupPlankaClient, getMe, createImportProject, createBoard, createList, createCard, createTask, createComment } = require('./client');
const { loadTrelloBoard, getBoardName, getTrelloLists, getTrelloCardsOfList, getAllTrelloCheckItemsOfCard, getTrelloCommentsOfCard } = require('../trello/export');
const { getImportProjectName } = require('../utils/cmd');
const { getImportedCommentText } = require('./comments');

const importTrelloBoard = async (config, filename) => {
    await loadTrelloBoard(filename);
    await setupPlankaClient(config.PLANKA_API_BASE, config.PLANKA_IMPORT_USER, config.PLANKA_IMPORT_PASSWORD);
    const me = await getMe();
    const { plankaBoard } = await createProjectAndBoard();

    await importLists(plankaBoard, me);
}

async function createProjectAndBoard() {
    const project = await createImportProject(getImportProjectName() || 'Trello Import');
    const plankaBoard = await createBoard({
        name: getBoardName(),
        projectId: project.id,
        type: 'kanban',
        position: 1
    });
    return { project, plankaBoard };
}

async function importLists(plankaBoard, me) {
    for (const trelloList of getTrelloLists()) {
        const plankaList = await createList({
            name: trelloList.name,
            boardId: plankaBoard.id,
            position: trelloList.pos
        });
        await importCards(trelloList, plankaBoard, plankaList, me);
    }
}

async function importCards(trelloList, plankaBoard, plankaList, me) {
    for (const trelloCard of getTrelloCardsOfList(trelloList.id)) {
        const plankaCard = await createCard({
            boardId: plankaBoard.id,
            listId: plankaList.id,
            position: trelloCard.pos,
            name: trelloCard.name,
            description: trelloCard.desc || null
        });
        
        await importTasks(trelloCard, plankaCard);
        await importComments(trelloCard, plankaCard, me);

        // TODO labels
        // TODO attachments        
    }
}

async function importTasks(trelloCard, plankaCard) {
    // TODO find workaround for tasks/checklist mismapping, see issue trello2planka#5
    for (const trelloCheckItem of getAllTrelloCheckItemsOfCard(trelloCard.id)) {
        await createTask({
            cardId: plankaCard.id,
            position: trelloCheckItem.pos,
            name: trelloCheckItem.name,
            isCompleted: trelloCheckItem.state === 'complete'
        });
    }
}

async function importComments(trelloCard, plankaCard, me) {
    const trelloComments = getTrelloCommentsOfCard(trelloCard.id);
    trelloComments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (const trelloComment of trelloComments) {
        const plankaComment = await createComment({
            cardId: plankaCard.id,
            type: 'commentCard',
            text: getImportedCommentText(trelloComment),
            userId: me.id
        });
    }
}

exports.importTrelloBoard = importTrelloBoard;
