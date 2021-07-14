import _ from 'lodash';
import { INITIAL_STATE } from '../reducers/filters';

const omitNonFilters = filters => _.omit(filters, ['expanded']);

export const getFiltersChanged = filters => {
  return !_.isEqual(omitNonFilters(filters), omitNonFilters(INITIAL_STATE));
};
