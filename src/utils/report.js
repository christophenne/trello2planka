import {readFileSync, writeFileSync} from 'fs';

const SENSIBLE_INFO = '*************************';

const reportFileName = new Date().toISOString();
const reportFilePath = 'reports/' + reportFileName + '.json';

const readReport = () => JSON.parse(readFileSync(reportFilePath));
const writeReport = (report) => writeFileSync(reportFilePath, JSON.stringify(report, null, 2));

export const reportStartup = (config, filename) => {
    writeReport({
        startedAt: new Date(),
        process: process.argv,
        config: {
            importOptions: config.importOptions,
            planka: {
                api: config.planka.api,
                importUser: config.planka.importUser,
                importPassword: SENSIBLE_INFO
            },
            ...(config.trello ? {
                trello: {
                    api: config.trello.api,
                    apiKey: SENSIBLE_INFO,
                    apiToken: SENSIBLE_INFO
                }
            } : {})
        },
        filename
    });
}

export const reportProjectAndBoard = (createdProject, createdBoard) => {
    const report = readReport();
    writeReport({
        ...report,
        createdProject,
        createdBoard,
    });
}
    
export const reportLabelMapping = (trelloToPlankaLabels) => {
    const report = readReport();
    writeReport({
        ...report,
        trelloToPlankaLabels,
    });
}

export const reportListMapping = (trelloList, plankaList) => {
    const report = readReport();
    writeReport({
        ...report,
        trelloToPlankaLists: {
            ...report.trelloToPlankaLists,
            [trelloList.id]: plankaList
        }
    });
}

export const reportCardMapping = (trelloCard, plankaCard) => {
    const report = readReport();
    writeReport({
        ...report,
        trelloToPlankaCards: {
            ...report.trelloToPlankaCards,
            [trelloCard.id]: plankaCard
        }
    });
}

export const reportTaskMapping = (trelloCheckItem, plankaTask) => {
    const report = readReport();
    writeReport({
        ...report,
        trelloCheckItemsToPlankaTasks: {
            ...report.trelloCheckItemsToPlankaTasks,
            [trelloCheckItem.id]: {
                trelloCheckListId: trelloCheckItem.idChecklist,
                plankaTask
            }
        }
    });
}

export const reportActionMapping = (trelloAction, plankaAction) => {
    const report = readReport();
    writeReport({
        ...report,
        trelloToPlankaActions: {
            ...report.trelloToPlankaActions,
            [trelloAction.id]: plankaAction
        }
    });
}

export const reportAttachmentMapping = (trelloAttachment, plankaAttachment) => {
    const report = readReport();
    writeReport({
        ...report,
        trelloToPlankaAttachments: {
            ...report.trelloToPlankaAttachments,
            [trelloAttachment.id]: plankaAttachment
        }
    });
}

export const reportDone = () => {
    const report = readReport();
    writeReport({
        ...report,
        finishedAt: new Date()
    });
}