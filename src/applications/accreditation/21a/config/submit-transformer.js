import { transformForSubmit as platformTransformForSubmit } from '~/platform/forms-system/exportsFile';

// TODO: implement
const transformForSubmit = (formConfig, form) => {
  return platformTransformForSubmit(formConfig, form, {
    allowPartialAddress: true,
  });
};

export default transformForSubmit;
