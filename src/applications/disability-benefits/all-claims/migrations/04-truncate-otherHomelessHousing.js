import omit from 'platform/utilities/data/omit';

import { MAX_HOUSING_STRING_LENGTH } from '../constants';

export default savedData => {
  if (savedData.formData.otherHomelessHousing) {
    const formData = omit('otherHomelessHousing', savedData.formData);
    formData.otherHomelessHousing = savedData.formData.otherHomelessHousing.substring(
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
