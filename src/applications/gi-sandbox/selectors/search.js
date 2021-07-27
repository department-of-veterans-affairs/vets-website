import _ from 'lodash';
import { INITIAL_STATE } from '../reducers/search';

export const getSearchQueryChanged = query => {
  return !_.isEqual(query, INITIAL_STATE.query);
};
