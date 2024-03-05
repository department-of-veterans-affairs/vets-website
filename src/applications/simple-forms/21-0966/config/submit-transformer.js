import sharedTransformForSubmit from '../../shared/config/submit-transformer';

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );

  return JSON.stringify({
    ...transformedData,
    benefitSelection: {
      compensation:
        transformedData.benefitSelection?.compensation ||
        !!transformedData.benefitSelectionCompensation,
      pension:
        transformedData.benefitSelection?.pension ||
        !!transformedData.benefitSelectionPension,
    },
  });
}
