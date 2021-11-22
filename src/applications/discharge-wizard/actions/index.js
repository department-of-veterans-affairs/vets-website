import { DW_UPDATE_FIELD } from '../constants';

export const updateField = (key, value) => {
  return {
    type: DW_UPDATE_FIELD,
    key,
    value,
  };
};
