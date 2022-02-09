import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import cloneDeep from 'platform/utilities/data/cloneDeep';

export const customCOEsubmit = (formConfig, form) => {
  const formCopy = cloneDeep(form);
  const formData = transformForSubmit(formConfig, formCopy);
  return JSON.stringify({
    lgyCoeClaim: {
      form: formData,
    },
  });
};
