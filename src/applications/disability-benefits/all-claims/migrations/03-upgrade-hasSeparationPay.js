import omit from 'platform/utilities/data/omit';

export default savedData => {
  if (savedData.formData['view:hasSeparationPay']) {
    const formData = omit('view:hasSeparationPay', savedData.formData);
    formData.hasSeparationPay = savedData.formData['view:hasSeparationPay'];
    return {
      formData,
      metadata: savedData.metadata,
    };
  }
  return savedData;
};
