import {createWriteStream} from 'node:fs';
import {pipeline} from 'node:stream';
import {promisify} from 'node:util'
import fetch from 'node-fetch';
import {ATTACHMENT_TMP_FILE} from '../utils/constants.js';

const streamPipeline = promisify(pipeline);

let api;
let apiKey;
let apiToken;

export const setupTrelloClient = (config) => {
    if(api || apiKey || apiToken) {
        throw new Error('Trello API already set up.');
    }
    if (!config?.trello?.api || !config?.trello?.apiKey || !config?.trello?.apiToken) {
        return;
    }
    api = config.trello.api;
    apiKey = config.trello.apiKey;
    apiToken = config.trello.apiToken;
}

export const downloadAttachment = async (cardId, attachmentId, fileName) => {
    const path = api + `cards/${cardId}/attachments/${attachmentId}/download/${fileName}`;
    console.log('fetching attachment from Trello API, path = ', path);
    const response = await fetch(path, { headers: getHeaders() });
    console.log('status = ', response.status);
    return streamPipeline(response.body, createWriteStream(ATTACHMENT_TMP_FILE)); // TODO use streams instead of writing to disk temporarily
};

const getHeaders = () => ({
    Authorization: 'OAuth oauth_consumer_key=\"' + apiKey + '\", oauth_token=\"' + apiToken + '\"'
});
