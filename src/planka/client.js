const request = require('request');
const { API_ACCESS_TOKENS, API_PROJECTS, API_BOARDS, API_LISTS, API_CARDS, API_TASKS } = require('./paths');

let apiBase;
let token;

const setupPlankaClient = async (apiBaseUrl, emailOrUsername, password) => new Promise((resolve, reject) => {
    if(apiBase || token) {
        reject(new Error('Planka API already set up.'));
        return;
    }
    request.post(resolvePlankaPath(apiBaseUrl, API_ACCESS_TOKENS), { json: { emailOrUsername, password }}, (err, response, {item, code}) => {
        if (err || response.statusCode !== 200) {
            reject(new Error('Could not obtain access token, status code: ' + response.statusCode + ' code: ' + code));
            return;
        }
        apiBase = apiBaseUrl;
        token = item;
        resolve(item);
    });
});

const createImportProject = async (projectName) => await authenticatedPost(API_PROJECTS, {}, {name: projectName});

const createBoard = async (board) => await authenticatedPost(API_BOARDS, {':projectId': board.projectId}, board);

const createList = async (list) => await authenticatedPost(API_LISTS, {':boardId': list.boardId}, list);

const createCard = async (card) => await authenticatedPost(API_CARDS, {':boardId': card.boardId}, card);

const createTask = async (task) => await authenticatedPost(API_TASKS, {':cardId': task.cardId}, task);

const authenticatedPost = async (resource, parameters, body) => new Promise((resolve, reject) => {
    const path = resolvePlankaPath(apiBase, resource, parameters);
    console.log('authenticated POST to ' + path);
    request.post(path, headersAndBody(body), (err, response, {item, code, problems}) => {
        problems && console.log(problems);
        if (err || response.statusCode !== 200) {
            reject(new Error('Failed to POST ' + path + ', status code: ' + response.statusCode + ' code: ' + code));
            return;
        }
        console.log('status = ' + response.statusCode);
        resolve(item);
    });
});

const resolvePlankaPath = (apiBaseUrl, resource, params) => 
    (apiBaseUrl + (apiBaseUrl.endsWith('/') ? '' : '/')) + resolveParams(resource, params);

const resolveParams = (resource, paramObj) => {
    let resolved = resource;
    paramObj && Object.entries(paramObj).forEach(entry => {
        resolved = resolved.replace(entry[0], entry[1]);
    });
    return resolved;
};

const headersAndBody = (body) => ({ json: { ...body }, headers: { Authorization: 'Bearer ' + token }});

exports.setupPlankaClient = setupPlankaClient;
exports.createImportProject = createImportProject;
exports.createBoard = createBoard;
exports.createList = createList;
exports.createCard = createCard;
exports.createTask = createTask;
