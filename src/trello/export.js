const fs = require('fs');

let trelloExport;

const loadTrelloExport = async (filename) => new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
        const exp = data && JSON.parse(data);
        if (err) {
            reject(err);
            return;
        }
        trelloExport = exp;
        resolve(exp);
    });
});

const getOrganization = (id) => trelloExport.organizations.find(o => o.id === id);

const getBoards = () => 
    trelloExport.boards.map((board) => ({
        name: '[' + getOrganization(board.idOrganization)?.displayName + '] ' + board.name
    }));

exports.loadTrelloExport = loadTrelloExport;
exports.getBoards = getBoards;
