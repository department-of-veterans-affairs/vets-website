import sharedTransformForSubmit from '../../shared/config/submit-transformer';

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );
  const {
    benefitSelectionCompensation,
    benefitSelectionPension,
  } = transformedData;

  if (benefitSelectionCompensation) {
    transformedData.benefitSelection = {
      compensation: true,
    };
  }
  if (benefitSelectionPension) {
    transformedData.benefitSelection = {
      pension: true,
    };
  }

  return JSON.stringify(transformedData);
}
