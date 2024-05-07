/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  const copyOfData = JSON.parse(JSON.stringify(transformedData));

  copyOfData.hasOtherHealthInsurance =
    copyOfData.applicantHasPrimary || copyOfData.applicantHasSecondary;

  copyOfData.applicantName.middle =
    copyOfData.applicantName?.middle?.charAt(0) ?? '';

  // go from medigapPlanA -> A
  if (copyOfData.primaryMedigapPlan) {
    copyOfData.primaryMedigapPlan = copyOfData.primaryMedigapPlan.slice(-1);
  }
  if (copyOfData.secondaryMedigapPlan) {
    copyOfData.secondaryMedigapPlan = copyOfData.secondaryMedigapPlan.slice(-1);
  }

  // Make sure all dates are in MM-DD-YYYY format
  Object.keys(copyOfData).forEach(key => {
    if (key.toLowerCase().includes('date')) {
      copyOfData[key] = new Date(copyOfData[key])
        // MM-DD-YYYY date w/ hyphens instead of slashes
        .toLocaleDateString('es-pa')
        .replace(/\//g, '-');
    }
  });

  copyOfData.certificationDate = new Date()
    .toLocaleDateString('es-pa')
    .replace(/\//g, '-');

  return JSON.stringify({
    ...copyOfData,
    form_number: formConfig.formId,
  });
}
