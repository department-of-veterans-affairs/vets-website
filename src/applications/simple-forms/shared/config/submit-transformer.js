import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

const replacer = (_key, value) => {
  // Replace double-quotes and non-escaping backslashes
  // with single-quotes and forward-slashes
  if (typeof value === 'string') {
    return value
      .replace(/"/gm, "'")
      .replace(/\\(?!(f|n|r|t|[u,U][\d,a-fA-F]{4}))/gm, '/');
  }

  return value;
};

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  return JSON.stringify(
    { ...transformedData, formNumber: formConfig.formId },
    replacer,
  );
}
