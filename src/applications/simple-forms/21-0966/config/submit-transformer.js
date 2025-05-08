import { cloneDeep } from 'lodash';
import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import {
  veteranBenefits,
  survivingDependentBenefits,
} from '../definitions/constants';
import { preparerIsVeteranAndHasPrefill } from './helpers';

export default function transformForSubmit(formConfig, form) {
  const formData = cloneDeep(form.data);

  if (preparerIsVeteranAndHasPrefill({ formData })) {
    formData.veteranFullName = formData['view:veteranPrefillStore'].fullName;
    formData.veteranId = { ssn: formData['view:veteranPrefillStore'].ssn };
  }

  // remove all view: fields
  Object.keys(formData)
    .filter(key => key.startsWith('view:'))
    .forEach(key => delete formData[key]);

  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, { ...form, data: formData }),
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
