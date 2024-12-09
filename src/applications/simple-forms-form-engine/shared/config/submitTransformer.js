import { transformForSubmit as platformTransformForSubmit } from 'platform/forms-system/exportsFile';

const transformForSubmit = (formConfig, form) => {
  const transformedData = platformTransformForSubmit(formConfig, form);

  // eslint-disable-next-line no-console
  console.log(transformedData);

  return JSON.stringify({
    ...transformedData,
    formNumber: formConfig.formId,
  });
};

export default transformForSubmit;
