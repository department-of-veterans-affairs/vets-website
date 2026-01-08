import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import _ from 'lodash';
import {
  transformPhoneNumberObject,
  transformMailingAddress,
  todaysDate,
} from '../helpers';

export default function transform(formConfig, form) {
  const data = _.cloneDeep(form.data);

  delete data.statementOfTruthCertified;
  delete data.AGREED;

  // since we're using the prefill/ContactInfo pattern for managing
  // the users address, phones, and email all the relevant data is
  // under the `veteran` key within formData buy default. We need
  // to extract and alter the shape a bit to conform to our schema
  data.homePhone = transformPhoneNumberObject(data.veteran.homePhone);
  data.mobilePhone = transformPhoneNumberObject(data.veteran.mobilePhone);
  if (data.homePhone === '') {
    delete data.homePhone;
  }
  if (data.mobilePhone === '') {
    delete data.mobilePhone;
  }
  data.mailingAddress = transformMailingAddress(data.veteran.mailingAddress);
  data.emailAddress = data.veteran.email?.emailAddress;
  delete data.veteran;

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
