import omit from 'platform/utilities/data/omit';

export default savedData => {
  const newData = omit('view:hasSeparationPay', savedData);
  newData.hasSeparationPay = savedData['view:hasSeparationPay'];
  return newData;
};
