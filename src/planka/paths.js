const API_ACCESS_TOKENS = 'access-tokens';
const API_PROJECTS = 'projects';
const API_BOARDS = 'projects/:projectId/boards';

const plankaPath = (apiBasePath, resource) => (apiBasePath + (apiBasePath.endsWith('/') ? '' : '/')) + resource;

exports.API_ACCESS_TOKENS = API_ACCESS_TOKENS;
exports.API_PROJECTS = API_PROJECTS;
exports.API_BOARDS = API_BOARDS;
exports.plankaPath = plankaPath;
