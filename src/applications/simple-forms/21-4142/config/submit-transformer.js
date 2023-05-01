import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import { veteranIsSelfText } from '../definitions/constants';

export default function transformForSubmit(formConfig, form) {
  let transformedData = JSON.parse(sharedTransformForSubmit(formConfig, form));

  const {
    first: veteranFirstName,
    middle: veteranMiddleName,
    last: veteranLastName,
    suffix: veteranSuffix,
  } = transformedData.veteran.fullName;

  if (
    transformedData.preparerIdentification.relationshipToVeteran ===
    veteranIsSelfText
  ) {
    transformedData = {
      ...transformedData,
      preparerIdentification: {
        preparerFullName: {
          first: veteranFirstName,
          middle: veteranMiddleName,
          last: veteranLastName,
          suffix: veteranSuffix,
        },
      },
    };
  }

  return JSON.stringify(transformedData);
}
