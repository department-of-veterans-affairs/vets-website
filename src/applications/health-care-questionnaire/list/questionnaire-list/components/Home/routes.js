import manifest from '../../../manifest.json';

const path = manifest.rootUrl;

const todoPath = `${path}/to-do`;
const completedPath = `${path}/completed`;
const deletePath = `${path}/delete`;

export { path, todoPath, completedPath, deletePath };
