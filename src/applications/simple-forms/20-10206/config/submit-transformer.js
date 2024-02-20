import sharedTransformForSubmit from '../../shared/config/submit-transformer';

import { PREPARER_TYPES, RECORD_TYPES } from './constants';

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );
  const preparerTypeIdData = {
    // hash-mapping of preparer-types to conditional identification form-data
    // preparer-types not listed here don't have any related data
    [PREPARER_TYPES.CITIZEN]: 'citizenId',
    [PREPARER_TYPES.NON_CITIZEN]: 'nonCitizenId',
  };
  const recordTypeDetailData = {
    // hash-mapping of record-types to conditional details form-data
    // record-types not listed here don't have any related data
    [RECORD_TYPES.DISABILITY_EXAMS]: 'disabilityExams',
    [RECORD_TYPES.OTHER_COMP_PEN]: 'otherCompAndPenDetails',
    [RECORD_TYPES.FINANCIAL]: 'financialRecordDetails',
    [RECORD_TYPES.LIFE_INS]: 'lifeInsuranceBenefitDetails',
    [RECORD_TYPES.OTHER]: 'otherBenefitDetails',
  };
  const { preparerType } = transformedData;
  const { recordSelections } = transformedData;

  // delete any unneeded identification form-data based on preparerType
  Object.keys(preparerTypeIdData).forEach(key => {
    // if preparer-type value doesn't match preparerTypeIdData-key, delete corresponding identification form-data (preparerTypeIdData[key])
    if (preparerType !== key) {
      delete transformedData[preparerTypeIdData[key]];
    }
  });

  // delete any unneeded detail form-data based on recordSelections
  Object.keys(recordTypeDetailData).forEach(key => {
    // if record-type is not selected, delete corresponding detail form-data
    if (!recordSelections[key]) {
      delete transformedData[recordTypeDetailData[key]];
    }
  });

  return sharedTransformForSubmit(formConfig, form);
}
