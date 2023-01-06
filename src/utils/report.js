import {readFileSync, writeFileSync} from 'fs';

const reportFileName = Date.now();
const reportFilePath = 'reports/' + reportFileName + '.json';

const readReport = () => JSON.parse(readFileSync(reportFilePath));
const saveReport = (report) => writeFileSync(reportFilePath, JSON.stringify(report, null, 2));

export const reportStartup = (config, filename) => {
    saveReport({
        startedAt: new Date(),
        process: process.argv,
        config: {
            importOptions: config.importOptions,
            planka: {
                api: config.planka.api,
                importUser: config.planka.importUser,
                importPassword: '*************************'
            },
            ...(config.trello ? {
                trello: {
                    api: config.trello.api,
                    apiKey: '*************************',
                    apiToken: '*************************'
                }
            } : {})
        },
        filename
    });
}

export const reportProjectAndBoard = (createdProject, createdBoard) => {
    const report = readReport();
    saveReport({
        ...report,
        createdProject,
        createdBoard,
    });
}

export const reportLabelMapping = (trelloToPlankaLabels) => {
    const report = readReport();
    saveReport({
        ...report,
        trelloToPlankaLabels
    });
}