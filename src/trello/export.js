import fs from 'fs';

let trelloBoard;

export const loadTrelloBoard = async (filename) => new Promise((resolve, reject) => {
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

export const getBoardName = () => trelloBoard.name;

export const getUsedTrelloLabels = () => {
    const result = {};
    trelloBoard.cards.map((card) => card.labels).flat().forEach((label) => {
        result[label.id] = label;
    });
    return Object.values(result);
};

export const getTrelloLists = () => trelloBoard.lists.filter(list => !list.closed);

export const getTrelloCardsOfList = (listId) => trelloBoard.cards.filter(l => (l.idList === listId) && !l.closed);

export const getAllTrelloCheckItemsOfCard = (cardId) => 
    trelloBoard.checklists.filter(c => c.idCard === cardId).map(checklist => checklist.checkItems).flat();

export const getTrelloCommentsOfCard = (cardId) =>
    trelloBoard.actions.filter(action => action.type === 'commentCard' && action.data?.card?.id === cardId);
