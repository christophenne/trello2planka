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

const getLists = () => trelloBoard.lists;

const getCardsOfList = (listId) => trelloBoard.cards.filter(l => l.idList === listId);

exports.loadTrelloBoard = loadTrelloBoard;
exports.getLists = getLists;
exports.getCardsOfList = getCardsOfList;
