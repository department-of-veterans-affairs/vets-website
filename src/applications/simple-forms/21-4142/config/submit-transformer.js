import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import { veteranIsSelfText, alternateSigner } from '../definitions/constants';

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
  } else if (
    transformedData.preparerIdentification.relationshipToVeteran ===
    alternateSigner
  ) {
    // This text will put in the PDF, and we want it as short as possible
    transformedData.preparerIdentification.relationshipToVeteran =
      'Alternate signer';
  }

  return JSON.stringify(transformedData);
}
