import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import _ from 'lodash';

const submitForm = (form, formConfig) => {
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);
  const selectedBenefits = _.get(form.data, 'view:benefit', {});
  let concatenatedBenefits = '';
  Object.keys(selectedBenefits).forEach(function(key) {
    if (selectedBenefits[key]) {
      if (concatenatedBenefits === '') {
        concatenatedBenefits = key;
      } else {
        concatenatedBenefits += ` ${key}`;
      }
    }
  });
  const eventData = {
    'edu-benefits-currently-used': concatenatedBenefits,
    'edu-currently-enrolled': form.data.isEnrolledStem ? 'Yes' : 'No',
    'edu-pursuing-teaching-certifcation': form.data.isPursuingTeachingCert
      ? 'Yes'
      : 'No',
    'edu-benefits-remaining': form.data.benefitLeft,
    'edu-name-of-degree': form.data.degreeName,
    'edu-stem-scholarship-school': form.data.schoolName,
    'edu-school-city': form.data.schoolCity,
    'edu-school-state': form.data.schoolState,
    'active-duty': form.data.isActiveDuty ? 'Yes' : 'No',
    'contact-method-preference': form.data.preferredContactMethod,
    'direct-deposit-account-type': _.get(form.data, 'accountType', 'none'),
  };

  return submitToUrl(
    body,
    formConfig.submitUrl,
    formConfig.trackingPrefix,
    eventData,
  );
};

export default submitForm;
