export const preProcessPoliceData = vamcPoliceData => {
  const { data } = vamcPoliceData;
  const { contact, statistics } = data;

  return {
    policeStatisticDataByVhaId: statistics,
    policeContactDataByVhaId: contact,
  };
};
