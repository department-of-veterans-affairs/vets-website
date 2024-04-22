import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  //
  // TODO: Make additional transformations here in the future
  //

  return JSON.stringify({
    ...transformedData,
    formNumber: formConfig.formId,
  });
}
