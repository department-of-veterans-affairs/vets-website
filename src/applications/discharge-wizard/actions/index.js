export const DW_UPDATE_FIELD = 'DW_UPDATE_FIELD';

export const updateField = (key, value) => {
  return {
    type: DW_UPDATE_FIELD,
    key,
    value,
  };
};
