import { TASKS } from '../constants';

export const getTaskFromUrl = url => {
  return Object.values(TASKS).find(key => url.includes(key)) || 'fallback';
};
