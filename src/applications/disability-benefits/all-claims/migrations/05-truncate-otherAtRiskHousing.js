import omit from 'platform/utilities/data/omit';

import { MAX_HOUSING_STRING_LENGTH } from '../constants';

export default savedData => {
  if (savedData.formData.otherAtRiskHousing) {
    const formData = omit('otherAtRiskHousing', savedData.formData);
    formData.otherAtRiskHousing = savedData.formData.otherAtRiskHousing.substring(
      0,
      MAX_HOUSING_STRING_LENGTH,
    );
    return {
      formData,
      metadata: savedData.metadata,
    };
  }
  return savedData;
};
