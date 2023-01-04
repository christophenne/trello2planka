const request = require('request');

let api;
let apiKey;
let apiToken;

const setupTrelloClient = (config) => {
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

const downloadAttachment = async (config, cardId, attachmentId, fileName) => new Promise((resolve, reject) => {
    const path = api + `cards/${cardId}/attachments/${attachmentId}/download/${fileName}`;
    console.log('fetching attachment from Trello API, path = ', path);
    request(path, { headers: getHeaders() }, (err, response, body) => {
        if (err) {
            console.error(err);
            reject(err);
            return;
        }
        console.log('After request, status = ' + response.statusCode);
        
        resolve(body);
    });
});

const getHeaders = () => ({
    Authorization: 'OAuth oauth_consumer_key=\"' + apiKey + '\", oauth_token=\"' + apiToken + '\"'
});

exports.setupTrelloClient = setupTrelloClient;
exports.downloadAttachment = downloadAttachment;
