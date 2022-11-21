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

const getBoardName = () => trelloBoard.name;

const getTrelloLists = () => trelloBoard.lists;

const getTrelloCardsOfList = (listId) => trelloBoard.cards.filter(l => l.idList === listId);

const getAllTrelloCheckItemsOfCard = (cardId) => 
    trelloBoard.checklists.filter(c => c.idCard === cardId).map(checklist => checklist.checkItems).flat();

const getTrelloCommentsOfCard = (cardId) =>
    trelloBoard.actions.filter(action => action.type === 'commentCard' && action.data?.card?.id === cardId);

exports.loadTrelloBoard = loadTrelloBoard;
exports.getBoardName = getBoardName;
exports.getTrelloLists = getTrelloLists;
exports.getTrelloCardsOfList = getTrelloCardsOfList;
exports.getAllTrelloCheckItemsOfCard = getAllTrelloCheckItemsOfCard;
exports.getTrelloCommentsOfCard = getTrelloCommentsOfCard;
