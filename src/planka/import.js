import { setupPlankaClient, getMe, createImportProject, createBoard, createLabel, createCardLabel, createList, createCard, createTask, createComment, createAttachment } from './client.js';
import { loadTrelloBoard, getBoardName, getTrelloLists, getTrelloCardsOfList, getAllTrelloCheckItemsOfCard, getTrelloCommentsOfCard, getUsedTrelloLabels } from '../trello/export.js';
import { getImportedCommentText } from './comments.js';
import { getPlankaLabelColor } from './labels.js';
import { setupTrelloClient, downloadAttachment } from '../trello/client.js';
import { reportLabelMapping, reportProjectAndBoard, reportStartup, reportListMapping, reportCardMapping, reportDone, reportTaskMapping, reportActionMapping, reportAttachmentMapping } from '../utils/report.js';

export const importTrelloBoard = async (config, filename) => {
    reportStartup(config, filename);
    await loadTrelloBoard(filename);
    await setupPlankaClient(config);
    setupTrelloClient(config);

    const me = await getMe();
    const { plankaBoard } = await createProjectAndBoard(config?.importOptions?.createdProjectName);

    const trelloToPlankaLabels = await importLabels(plankaBoard);
    await importLists(plankaBoard, {config, me, trelloToPlankaLabels});
    reportDone();
}

async function createProjectAndBoard(createdProjectName) {
    const project = await createImportProject(createdProjectName || 'Trello Import');
    const plankaBoard = await createBoard({
        name: getBoardName(),
        projectId: project.id,
        type: 'kanban',
        position: 1
    });
    reportProjectAndBoard(project, plankaBoard);
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
        trelloToPlankaLabels[trelloLabel.id] = plankaLabel;
    }
    reportLabelMapping(trelloToPlankaLabels);
    return trelloToPlankaLabels;
}

async function importLists(plankaBoard, {config, me, trelloToPlankaLabels}) {
    for (const trelloList of getTrelloLists()) {
        const plankaList = await createList({
            name: trelloList.name,
            boardId: plankaBoard.id,
            position: trelloList.pos
        });
        reportListMapping(trelloList, plankaList);

        await importCards(trelloList, plankaBoard, plankaList, {config, me, trelloToPlankaLabels});
    }
}

async function importCards(trelloList, plankaBoard, plankaList, {config, me, trelloToPlankaLabels}) {
    for (const trelloCard of getTrelloCardsOfList(trelloList.id)) {
        const plankaCard = await createCard({
            boardId: plankaBoard.id,
            listId: plankaList.id,
            position: trelloCard.pos,
            name: trelloCard.name,
            description: trelloCard.desc || null
        });
        reportCardMapping(trelloCard, plankaCard);

        await importCardLabels(trelloCard, plankaCard, trelloToPlankaLabels);
        await importTasks(trelloCard, plankaCard);
        await importComments(trelloCard, plankaCard, me);
        await importAttachments(trelloCard, plankaCard, config);    
    }
}

async function importCardLabels(trelloCard, plankaCard, trelloToPlankaLabels) {
    for (const trelloLabel of trelloCard.labels) {
        await createCardLabel({
            cardId: plankaCard.id,
            labelId: trelloToPlankaLabels[trelloLabel.id].id
        });
    }
}

async function importTasks(trelloCard, plankaCard) {
    // TODO find workaround for tasks/checklist mismapping, see issue trello2planka#5
    for (const trelloCheckItem of getAllTrelloCheckItemsOfCard(trelloCard.id)) {
        const plankaTask = await createTask({
            cardId: plankaCard.id,
            position: trelloCheckItem.pos,
            name: trelloCheckItem.name,
            isCompleted: trelloCheckItem.state === 'complete'
        });
        reportTaskMapping(trelloCheckItem, plankaTask);
    }
}

async function importComments(trelloCard, plankaCard, me) {
    const trelloComments = getTrelloCommentsOfCard(trelloCard.id);
    trelloComments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (const trelloComment of trelloComments) {
        const plankaAction = await createComment({
            cardId: plankaCard.id,
            type: 'commentCard',
            text: getImportedCommentText(trelloComment),
            userId: me.id
        });
        reportActionMapping(trelloComment, plankaAction);
    }
}

async function importAttachments(trelloCard, plankaCard, config) {
    if(!config?.importOptions?.fetchAttachments) {
        return;
    }
    for(const trelloAttachment of trelloCard.attachments) {
        await downloadAttachment(trelloCard.id, trelloAttachment.id, trelloAttachment.fileName);
        const plankaAttachment = await createAttachment(plankaCard.id, trelloAttachment.fileName);
        reportAttachmentMapping(trelloAttachment, plankaAttachment);
    }
}
