export const hasMedicare = formData => !!formData['view:hasMedicare'];

export const hasPartsAB = formData =>
  hasMedicare(formData) && formData.medicarePlanType === 'ab';

export const hasPartA = formData =>
  hasMedicare(formData) && formData.medicarePlanType === 'a';

export const hasPartB = formData =>
  hasMedicare(formData) && formData.medicarePlanType === 'b';

export const hasPartC = formData =>
  hasMedicare(formData) && formData.medicarePlanType === 'c';

export const hasPartsABorC = formData =>
  (hasMedicare(formData) && hasPartsAB(formData)) || hasPartC(formData);

export const hasPartD = formData =>
  hasMedicare(formData) && formData.medicarePartDStatus;

export const needsPartADenialNotice = formData =>
  hasPartB(formData) ||
  (!hasMedicare(formData) && formData['view:applicantAgeOver65']);

export const hasPartADenialNotice = formData =>
  needsPartADenialNotice(formData) &&
  formData['view:partADenialNotice']['view:hasPartADenial'];
