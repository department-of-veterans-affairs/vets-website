import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  // eslint-disable-next-line no-console
  console.log('Custom transformer called with data: ', transformedData);

  // Make changes to transformedData here...

  // eslint-disable-next-line no-console
  console.log('Transformed data: ', transformedData);

  return JSON.stringify({ ...transformedData });
}
