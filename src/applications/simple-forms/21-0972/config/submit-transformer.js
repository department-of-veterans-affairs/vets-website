import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import {
  preparerQualificationsOptions,
  preparerSigningReasonOptions,
} from '../definitions/constants';

export default function transformForSubmit(formConfig, form) {
  let transformedData = JSON.parse(sharedTransformForSubmit(formConfig, form));

  const preparerQualifications = transformedData?.preparerQualifications;
  let booleanPreparerQualifications = {};
  const preparerSigningReason = transformedData?.preparerSigningReason;
  let booleanPreparerSigningReason = {};

  if (preparerQualifications) {
    booleanPreparerQualifications = {
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

  if (preparerSigningReason) {
    booleanPreparerSigningReason = {
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

  transformedData = {
    ...transformedData,
    preparerQualifications: {
      ...booleanPreparerQualifications,
    },
    preparerSigningReason: {
      ...booleanPreparerSigningReason,
    },
  };

  return JSON.stringify(transformedData);
}
