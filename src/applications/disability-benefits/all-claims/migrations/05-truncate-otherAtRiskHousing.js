import omit from 'platform/utilities/data/omit';

export default savedData => {
  if (savedData.otherAtRiskHousing) {
    const newData = omit('otherAtRiskHousing', savedData);
    newData.otherAtRiskHousing = savedData.otherAtRiskHousing.substring(0, 499);
    return newData;
  }
  return savedData;
};
