import _ from 'lodash/fp';
import { transformForSubmit } from '../../common/schemaform/helpers';

export function transform(formConfig, form) {
  // All the king's horses and all the king's men
  //  Put newSchool back together again.
  const repairedForm = _.set('newSchool.data.newSchool', {
    name: form.newSchool.data.newSchoolName,
    address: form.newSchool.data.newSchoolAddress
  }, form);
  delete repairedForm.newSchool.data.newSchoolName;
  delete repairedForm.newSchool.data.newSchoolAddress;

  const formData = transformForSubmit(formConfig, repairedForm);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData
    }
  });
}

