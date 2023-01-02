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

const getUsedTrelloLabels = () => {
    const result = {};
    trelloBoard.cards.map((card) => card.labels).flat().forEach((label) => {
        result[label.id] = label;
    });
    return Object.values(result);
};

const getTrelloLists = () => trelloBoard.lists.filter(list => !list.closed);

const getTrelloCardsOfList = (listId) => trelloBoard.cards.filter(l => (l.idList === listId) && !l.closed);

const getAllTrelloCheckItemsOfCard = (cardId) => 
    trelloBoard.checklists.filter(c => c.idCard === cardId).map(checklist => checklist.checkItems).flat();

const getTrelloCommentsOfCard = (cardId) =>
    trelloBoard.actions.filter(action => action.type === 'commentCard' && action.data?.card?.id === cardId);

exports.loadTrelloBoard = loadTrelloBoard;
exports.getBoardName = getBoardName;
exports.getTrelloLists = getTrelloLists;
exports.getUsedTrelloLabels = getUsedTrelloLabels;
exports.getTrelloCardsOfList = getTrelloCardsOfList;
exports.getAllTrelloCheckItemsOfCard = getAllTrelloCheckItemsOfCard;
exports.getTrelloCommentsOfCard = getTrelloCommentsOfCard;
