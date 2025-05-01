import { defer } from 'react-router-dom-v5-compat';
import { store } from '../store';
import { getAllergies } from '../api/allergiesApi';

export const allergiesLoader = () => {
  return defer(store.dispatch(getAllergies.initiate(undefined)));
};
