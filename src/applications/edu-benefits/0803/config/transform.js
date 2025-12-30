import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import _ from 'lodash';
import { getTransformIntlPhoneNumber, todaysDate } from '../helpers';

export default function transform(formConfig, form) {
  const data = _.cloneDeep(form.data);

  delete data.statementOfTruthCertified;
  delete data.AGREED;

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

  // Make sure testCost is sent as a number
  if (data.testCost) {
    data.testCost = parseInt(data.testCost, 10);
  }

  // Organization address is assumed to be within the US
  data.organizationAddress.country = 'USA';

  // Set dateSigned
  data.dateSigned = todaysDate();

  const submitData = transformForSubmit(formConfig, { ...form, data });

  return JSON.stringify({
    educationBenefitsClaim: {
      form: submitData,
    },
  });
}
