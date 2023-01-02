const { setupPlankaClient, getMe, createImportProject, createBoard, createLabel, createCardLabel, createList, createCard, createTask, createComment } = require('./client');
const { loadTrelloBoard, getBoardName, getTrelloLists, getTrelloCardsOfList, getAllTrelloCheckItemsOfCard, getTrelloCommentsOfCard, getUsedTrelloLabels } = require('../trello/export');
const { getImportProjectName } = require('../utils/cmd');
const { getImportedCommentText } = require('./comments');
const { getPlankaLabelColor } = require('./labels');

const importTrelloBoard = async (config, filename) => {
    await loadTrelloBoard(filename);
    await setupPlankaClient(config.PLANKA_API_BASE, config.PLANKA_IMPORT_USER, config.PLANKA_IMPORT_PASSWORD);
    const me = await getMe();
    const { plankaBoard } = await createProjectAndBoard();

    const trelloToPlankaLabels = await importLabels(plankaBoard);
    await importLists(plankaBoard, {me, trelloToPlankaLabels});
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

async function importLabels(plankaBoard) {
    const trelloToPlankaLabels = {};
    for(const trelloLabel of getUsedTrelloLabels()) {
        const plankaLabel = await createLabel({
            boardId: plankaBoard.id,
            name: trelloLabel.name || null,
            color: getPlankaLabelColor(trelloLabel.color)
        });
        trelloToPlankaLabels[trelloLabel.id] = plankaLabel.id;
    }
    return trelloToPlankaLabels;
}

async function importLists(plankaBoard, {me, trelloToPlankaLabels}) {
    for (const trelloList of getTrelloLists()) {
        const plankaList = await createList({
            name: trelloList.name,
            boardId: plankaBoard.id,
            position: trelloList.pos
        });
        await importCards(trelloList, plankaBoard, plankaList, {me, trelloToPlankaLabels});
    }
}

async function importCards(trelloList, plankaBoard, plankaList, {me, trelloToPlankaLabels}) {
    for (const trelloCard of getTrelloCardsOfList(trelloList.id)) {
        const plankaCard = await createCard({
            boardId: plankaBoard.id,
            listId: plankaList.id,
            position: trelloCard.pos,
            name: trelloCard.name,
            description: trelloCard.desc || null
        });
        
        await importCardLabels(trelloCard, plankaCard, trelloToPlankaLabels);
        await importTasks(trelloCard, plankaCard);
        await importComments(trelloCard, plankaCard, me);

        // TODO labels
        // TODO attachments        
    }
}

async function importCardLabels(trelloCard, plankaCard, trelloToPlankaLabels) {
    for (const trelloLabel of trelloCard.labels) {
        await createCardLabel({
            cardId: plankaCard.id,
            labelId: trelloToPlankaLabels[trelloLabel.id]
        });
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
