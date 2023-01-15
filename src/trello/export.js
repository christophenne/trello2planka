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

const includeItem = (item, includeArchived) => includeArchived || !item?.closed;

export const getTrelloLists = (includeArchived) => 
    trelloBoard.lists.filter(list => includeItem(list, includeArchived));

export const getTrelloCardsOfList = (listId, includeArchived) => 
    trelloBoard.cards.filter(l => (l.idList === listId)).filter(l => includeItem(l, includeArchived));

export const getAllTrelloCheckItemsOfCard = (cardId) => 
    trelloBoard.checklists.filter(c => c.idCard === cardId).map(checklist => checklist.checkItems).flat();

export const getTrelloCommentsOfCard = (cardId) =>
    trelloBoard.actions.filter(action => action.type === 'commentCard' && action.data?.card?.id === cardId);
