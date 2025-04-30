import { store } from '../store';
import { getAllergies } from '../api/allergiesApi';

export const allergiesLoader = async () => {
  await store.dispatch(getAllergies.initiate(undefined));
  return null;
};
