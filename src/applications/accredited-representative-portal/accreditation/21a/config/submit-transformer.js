import { transformForSubmit as platformTransformForSubmit } from '~/platform/forms-system/exportsFile';

const transformForSubmit = (formConfig, form) => {
  return platformTransformForSubmit(formConfig, form, {
    allowPartialAddress: true,
  });
};

export default transformForSubmit;
