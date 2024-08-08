import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import {
  veteranBenefits,
  survivingDependentBenefits,
} from '../definitions/constants';

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );

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
