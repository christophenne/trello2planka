const fs = require('fs');

let trelloBoard;

const loadTrelloBoard = async (filename) => new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
        const exp = data && JSON.parse(data);
        if (err) {
            reject(err);
            return;
        }
        trelloBoard = exp;
        resolve(exp);
    });
});

const getOrganization = (id) => trelloBoard.organizations.find(o => o.id === id);

const getLists = () => 
    trelloBoard.lists.map((list) => ({
        name: list.name
    }));

exports.loadTrelloBoard = loadTrelloBoard;
exports.getLists = getLists;
