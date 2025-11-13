import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import _ from 'lodash';
import { getTransformIntlPhoneNumber } from '../helpers';

export default function transform(formConfig, form) {
  const data = _.cloneDeep(form.data);

  delete data.statementOfTruthCertified;
  if (data.homePhone) {
    data.homePhone = getTransformIntlPhoneNumber(data.homePhone);
  }
  if (data.mobilePhone) {
    data.mobilePhone = getTransformIntlPhoneNumber(data.mobilePhone);
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
