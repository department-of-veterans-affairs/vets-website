/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

function getPrimaryContact(data) {
  // For callback API we need to know what data in the form should be
  // treated as the primary contact. Determined based on `certifierRole`:
  const useCert = data.certifierRole !== 'applicant';
  return {
    name: (useCert ? data?.certifierName : data?.applicantName) ?? false,
    email:
      (useCert ? data?.certifierEmail : data?.applicantEmailAddress) ?? false,
    phone: (useCert ? data?.certifierPhone : data?.applicantPhone) ?? false,
  };
}

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

  // Set this for the callback API so it knows who to contact if there's
  // a status event notification
  copyOfData.primaryContactInfo = getPrimaryContact(copyOfData);

  return JSON.stringify({
    ...copyOfData,
    form_number: formConfig.formId,
  });
}
