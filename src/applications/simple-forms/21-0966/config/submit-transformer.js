import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import {
  veteranBenefits,
  survivingDependentBenefits,
} from '../definitions/constants';

export default function transformForSubmit(formConfig, form) {
  const sharedTransformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );

  // We need to transform the data this way because the prefill keys don't have the 'veteran'
  // prefix. The backend expects 'veteranFullName' and not 'fullName', for example.
  const transformedData = {
    ...sharedTransformedData,
    veteranFullName:
      sharedTransformedData.veteranFullName || sharedTransformedData.fullName,
    veteranDateOfBirth:
      sharedTransformedData.veteranDateOfBirth ||
      sharedTransformedData.dateOfBirth,
    veteranId: {
      ssn: sharedTransformedData.veteranId.ssn || sharedTransformedData.ssn,
      vaFileNumber: sharedTransformedData.veteranId.vaFileNumber,
    },
    veteranMailingAddress:
      sharedTransformedData.veteranMailingAddress ||
      sharedTransformedData.address,
    veteranPhone:
      sharedTransformedData.veteranPhone ||
      (sharedTransformedData.homePhone || sharedTransformedData.mobilePhone),
    veteranEmail:
      sharedTransformedData.veteranEmail || sharedTransformedData.email,
  };

  // These properties are supplied by prefill, not the user
  delete transformedData.fullName;
  delete transformedData.dateOfBirth;
  delete transformedData.ssn;
  delete transformedData.address;
  delete transformedData.homePhone;
  delete transformedData.mobilePhone;
  delete transformedData.email;

  return JSON.stringify({
    ...transformedData,
    benefitSelection: {
      [veteranBenefits.COMPENSATION]:
        transformedData.benefitSelection?.[veteranBenefits.COMPENSATION] ||
        transformedData.benefitSelectionCompensation,
      [veteranBenefits.PENSION]:
        transformedData.benefitSelection?.[veteranBenefits.PENSION] ||
        transformedData.benefitSelectionPension,
      [survivingDependentBenefits.SURVIVOR]:
        transformedData.benefitSelection?.[survivingDependentBenefits.SURVIVOR],
    },
  });
}
