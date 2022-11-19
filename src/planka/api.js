const request = require('request');
const { plankaPath, API_ACCESS_TOKENS, API_PROJECTS, API_BOARDS } = require('./paths');

let apiBase;
let token;

const login = async (apiBaseUrl, emailOrUsername, password) => new Promise((resolve, reject) => {
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
    request.post(plankaPath(apiBase, API_PROJECTS), 
        { json: { name: projectName }, headers: { Authorization: 'Bearer ' + token}}, (err, response, {item, code}) => {
        if (err || response.statusCode !== 200) {
            reject(new Error('Could not create import project, status code: ' + response.statusCode + ' code: ' + code));
            return;
        }
        resolve(item);
    });
});

const createBoard = async (board) => new Promise((resolve, reject) => {
    request.post(plankaPath(apiBase, API_BOARDS.replace(':projectId', board.projectId)), 
        { json: { ...board }, headers: { Authorization: 'Bearer ' + token}}, (err, response, {item, code}) => {
        if (err || response.statusCode !== 200) {
            reject(new Error('Could not create board, status code: ' + response.statusCode + ' code: ' + code));
            return;
        }
        resolve(item);
    });
});

exports.login = login;
exports.createImportProject = createImportProject;
exports.createBoard = createBoard;
