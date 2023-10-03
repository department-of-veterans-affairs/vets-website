import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import {
  preparerQualificationsOptions,
  preparerSigningReasonOptions,
} from '../definitions/constants';

function booleanPreparerQualifications(preparerQualifications) {
  let booleanPreparerQualificationsOutput = {};

  if (preparerQualifications) {
    booleanPreparerQualificationsOutput = {
      'court-appointed-rep': preparerQualifications.includes(
        preparerQualificationsOptions.COURT_APPOINTED_REP,
      ),
      attorney: preparerQualifications.includes(
        preparerQualificationsOptions.ATTORNEY,
      ),
      caregiver: preparerQualifications.includes(
        preparerQualificationsOptions.CAREGIVER,
      ),
      manager: preparerQualifications.includes(
        preparerQualificationsOptions.MANAGER,
      ),
    };
  }

  return booleanPreparerQualificationsOutput;
}

function booleanPreparerSigningReason(preparerSigningReason) {
  let booleanPreparerSigningReasonOutput = {};

  if (preparerSigningReason) {
    booleanPreparerSigningReasonOutput = {
      under18: preparerSigningReason.includes(
        preparerSigningReasonOptions.UNDER18,
      ),
      'mentally-incapable': preparerSigningReason.includes(
        preparerSigningReasonOptions.MENTALLY_INCAPABLE,
      ),
      'physically-incapable': preparerSigningReason.includes(
        preparerSigningReasonOptions.PHYSICALLY_INCAPABLE,
      ),
    };
  }

  return booleanPreparerSigningReasonOutput;
}

export default function transformForSubmit(formConfig, form) {
  let transformedData = JSON.parse(sharedTransformForSubmit(formConfig, form));

  transformedData = {
    ...transformedData,
    preparerQualifications: {
      ...booleanPreparerQualifications(transformedData?.preparerQualifications),
    },
    preparerSigningReason: {
      ...booleanPreparerSigningReason(transformedData?.preparerSigningReason),
    },
  };

  return JSON.stringify(transformedData);
}
