const request = require('request');
const { plankaPath, API_ACCESS_TOKENS, API_PROJECTS, API_BOARDS, API_LISTS, API_CARDS, API_TASKS } = require('./paths');

let apiBase;
let token;

const loginToPlanka = async (apiBaseUrl, emailOrUsername, password) => new Promise((resolve, reject) => {
    request.post(plankaPath(apiBaseUrl, API_ACCESS_TOKENS), { json: { emailOrUsername, password }}, (err, response, {item, code}) => {
        if (err || response.statusCode !== 200) {
            reject(new Error('Could not obtain access token, status code: ' + response.statusCode + ' code: ' + code));
            return;
        }
        apiBase = apiBaseUrl;
        token = item;
        resolve(item);
    });
});

const createImportProject = async (projectName) => new Promise((resolve, reject) => {
    request.post(plankaPath(apiBase, API_PROJECTS), headersAndBody({name: projectName}), (err, response, {item, code}) => {
        if (err || response.statusCode !== 200) {
            reject(new Error('Could not create import project, status code: ' + response.statusCode + ' code: ' + code));
            return;
        }
        resolve(item);
    });
});

const createBoard = async (board) => new Promise((resolve, reject) => {
    request.post(plankaPath(apiBase, API_BOARDS.replace(':projectId', board.projectId)), headersAndBody(board), (err, response, {item, code}) => {
        if (err || response.statusCode !== 200) {
            reject(new Error('Could not create board, status code: ' + response.statusCode + ' code: ' + code));
            return;
        }
        resolve(item);
    });
});

const createList = async (list) => new Promise((resolve, reject) => {
    request.post(plankaPath(apiBase, API_LISTS.replace(':boardId', list.boardId)), headersAndBody(list), (err, response, {item, code}) => {
        if (err || response.statusCode !== 200) {
            reject(new Error('Could not create list, status code: ' + response.statusCode + ' code: ' + code));
            return;
        }
        resolve(item);
    });
});

const createCard = async (card) => new Promise((resolve, reject) => {
    request.post(plankaPath(apiBase, API_CARDS.replace(':boardId', card.boardId)), headersAndBody(card), (err, response, {item, code}) => {
        if (err || response.statusCode !== 200) {
            reject(new Error('Could not create card, status code: ' + response.statusCode + ' code: ' + code));
            return;
        }
        resolve(item);
    });
});

const createTask = async (task) => new Promise((resolve, reject) => {
    request.post(plankaPath(apiBase, API_TASKS.replace(':cardId', task.cardId)), headersAndBody(task), (err, response, {item, code}) => {
        if (err || response.statusCode !== 200) {
            reject(new Error('Could not create task, status code: ' + response.statusCode + ' code: ' + code));
            return;
        }
        resolve(item);
    });
});

const headersAndBody = (body) => ({ json: { ...body }, headers: { Authorization: 'Bearer ' + token }});

exports.loginToPlanka = loginToPlanka;
exports.createImportProject = createImportProject;
exports.createBoard = createBoard;
exports.createList = createList;
exports.createCard = createCard;
exports.createTask = createTask;
