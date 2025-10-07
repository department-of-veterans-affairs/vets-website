export { medications } from './medications';
export { user } from './user';

/**
 * Combined scenarios that set up complete application states
 */
export const scenarios = {
  medications: require('./medications').medications,
  user: require('./user').user,
};
