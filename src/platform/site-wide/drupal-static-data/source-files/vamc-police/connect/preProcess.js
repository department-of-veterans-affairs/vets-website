export const preProcessPoliceData = vamcPoliceData => {
  const { data } = vamcPoliceData;

  return {
    policeDataByVhaId: data,
  };
};
