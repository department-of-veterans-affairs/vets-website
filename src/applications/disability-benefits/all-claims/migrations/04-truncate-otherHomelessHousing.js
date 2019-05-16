import omit from 'platform/utilities/data/omit';

export default savedData => {
  if (savedData.otherHomelessHousing) {
    const newData = omit('otherHomelessHousing', savedData);
    newData.otherHomelessHousing = savedData.otherHomelessHousing.substring(
      0,
      499,
    );
    return newData;
  }
  return savedData;
};
