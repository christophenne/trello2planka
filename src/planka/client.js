import fetch, {FormData, blobFrom} from 'node-fetch';
import { 
    API_ACCESS_TOKENS, 
    API_ME, 
    API_PROJECTS, 
    API_BOARDS, 
    API_LABELS, 
    API_CARD_LABELS, 
    API_LISTS, 
    API_CARDS, 
    API_TASKS, 
    API_COMMENTS, 
    API_ATTACHMENTS
} from './paths.js';
import {rmSync} from 'fs';
import {ATTACHMENT_TMP_FILE} from '../utils/constants.js';

let apiBase;
let token;

export const setupPlankaClient = async (config) => {
    if(apiBase || token) {
        reject(new Error('Planka API already set up.'));
        return;
    }
    const response = await fetch(resolvePlankaPath(config.planka.api, API_ACCESS_TOKENS), {
        method: 'POST',
        body: JSON.stringify({ 
            emailOrUsername: config.planka.importUser, 
            password: config.planka.importPassword 
        })
    });
    const {item, code} = await response.json();
    if(!item || code) {
        throw new Error(`Failed to fetch planka access token, code: ${code}`);
    }
    apiBase = config.planka.api;
    token = item;
    return item;
};

export const getMe = async () => await authenticatedGet(API_ME);

export const createImportProject = async (projectName) => await authenticatedPost(API_PROJECTS, {}, {name: projectName});

export const createBoard = async (board) => await authenticatedPost(API_BOARDS, {':projectId': board.projectId}, board);

export const createLabel = async (label) => await authenticatedPost(API_LABELS, {':boardId': label.boardId}, label);

export const createCardLabel = async (cardLabel) => await authenticatedPost(API_CARD_LABELS, {':cardId': cardLabel.cardId}, cardLabel);

export const createList = async (list) => await authenticatedPost(API_LISTS, {':boardId': list.boardId}, list);

export const createCard = async (card) => await authenticatedPost(API_CARDS, {':listId': card.listId}, card);

export const createTask = async (task) => await authenticatedPost(API_TASKS, {':cardId': task.cardId}, task);

export const createComment = async (comment) => await authenticatedPost(API_COMMENTS, {':cardId': comment.cardId}, comment);

export const createAttachment = async (cardId, fileName) => await authenticatedPostFileUpload(API_ATTACHMENTS, {':cardId': cardId}, fileName);

const authenticatedPost = async (resource, parameters, body) => {
    const path = resolvePlankaPath(apiBase, resource, parameters);
    console.log('authenticated POST to ' + path);
    const response = await fetch(path, {
        method: 'POST',
        ...headersAndBody(body)
    });
    const {item, code, problems} = await response.json();
    if(!item || code || problems) {
        throw new Error(`authenticated POST failed, status code = ${response.status}, code = ${code}, problems = ${problems}`);
    }
    console.log('status = ', response.status);
    return item;
};

const authenticatedPostFileUpload = async (resource, parameters, fileName) => {
    const path = resolvePlankaPath(apiBase, resource, parameters);
    console.log('authenticated POST with file upload to ' + path);
    const formData = new FormData();
    formData.set('file', await blobFrom(ATTACHMENT_TMP_FILE), fileName);
    const response = await fetch(path, {
        method: 'POST',
        body: formData,
        ...getHeaders()
    });
    const {item, code, problems} = await response.json();
    if(!item || code || problems) {
        throw new Error(`authenticated POST failed, status code = ${response.status}, code = ${code}, problems = ${problems}`);
    }
    rmSync(ATTACHMENT_TMP_FILE);
    console.log('status = ', response.status);
    return item;
}

const authenticatedGet = async (resource) =>  {
    const path = resolvePlankaPath(apiBase, resource, {});
    console.log('authenticated GET to ' + path);
    const response = await fetch(path, {headers: { Authorization: 'Bearer ' + token }});
    const {item, code, problems} = await response.json();
    if(!item || code || problems) {
        throw new Error(`authenticated GET failed, status code = ${response.status}, code = ${code}, problems = ${problems}`);
    }
    console.log('status = ', response.status);
    return item;
};

const resolvePlankaPath = (apiBaseUrl, resource, params) => 
    (apiBaseUrl + (apiBaseUrl.endsWith('/') ? '' : '/')) + resolveParams(resource, params);

const resolveParams = (resource, paramObj) => {
    let resolved = resource;
    paramObj && Object.entries(paramObj).forEach(entry => {
        resolved = resolved.replace(entry[0], entry[1]);
    });
    return resolved;
};

const headersAndBody = (body) => ({ body: JSON.stringify({...body }), ...getHeaders()});

const getHeaders = () => ({ headers: { Authorization: 'Bearer ' + token } });
