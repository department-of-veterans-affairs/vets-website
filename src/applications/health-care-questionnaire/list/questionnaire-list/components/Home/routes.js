import manifest from '../../../manifest.json';

const path = manifest.rootUrl;

const todoPath = `${path}/todo`;
const completedPath = `${path}/completed`;

export { path, todoPath, completedPath };
