import { store } from '../store';
import { getAllergies } from '../api/allergiesApi';

export const allergiesLoader = async () => {
  await store
    .dispatch(getAllergies.initiate(undefined, { subscribe: false }))
    .unwrap(); // Surface any errors to the router.
  return null;
};
