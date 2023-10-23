export const removeVhaPrefix = vhaId => {
  const regex = /vha_/;
  return vhaId.replace(regex, '');
};

export const getVamcSystemNameFromVhaId = (ehrDataByVhaId, vhaId) => {
  return ehrDataByVhaId[vhaId]?.vamcSystemName;
};
