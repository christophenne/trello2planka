const API_ACCESS_TOKENS = 'access-tokens';
const API_PROJECTS = 'projects';
const API_BOARDS = 'projects/:projectId/boards';
const API_LISTS = 'boards/:boardId/lists';
const API_CARDS = 'boards/:boardId/cards';

const plankaPath = (apiBasePath, resource) => (apiBasePath + (apiBasePath.endsWith('/') ? '' : '/')) + resource;

exports.API_ACCESS_TOKENS = API_ACCESS_TOKENS;
exports.API_PROJECTS = API_PROJECTS;
exports.API_BOARDS = API_BOARDS;
exports.API_LISTS = API_LISTS;
exports.API_CARDS = API_CARDS;
exports.plankaPath = plankaPath;
