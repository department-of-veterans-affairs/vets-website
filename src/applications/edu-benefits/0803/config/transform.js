import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import _ from 'lodash';
import { getTransformIntlPhoneNumber } from '../helpers';

export default function transform(formConfig, form) {
  const data = _.cloneDeep(form.data);

  delete data.statementOfTruthCertified;

  // phone numbers are from 'international phone' input, and
  // so come as an object, but we only want to send a string
  // to the back-end. Also, they're optional, so don't send
  // anything if no phone number is present.
  data.homePhone = getTransformIntlPhoneNumber(data.homePhone);
  data.mobilePhone = getTransformIntlPhoneNumber(data.mobilePhone);
  if (data.homePhone === '') {
    delete data.homePhone;
  }
  if (data.mobilePhone === '') {
    delete data.mobilePhone;
  }

  if (data.testCost) {
    data.testCost = parseInt(data.testCost, 10);
  }

  const submitData = transformForSubmit(formConfig, { ...form, data });

  return JSON.stringify({
    educationBenefitsClaim: {
      form: submitData,
    },
  });
}
