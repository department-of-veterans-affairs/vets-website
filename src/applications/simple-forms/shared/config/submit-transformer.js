import {
  transformForSubmit as formsSystemTransformForSubmit,
  stringifyFormReplacer,
} from 'platform/forms-system/src/js/helpers';

const escapedCharacterReplacer = (_key, value) => {
  if (typeof value === 'string') {
    return value
      .replaceAll('"', "'")
      .replace(/(?:\r\n|\n\n|\r|\n)/g, '; ')
      .replace(/(?:\t|\f|\b)/g, '')
      .replace(/\\(?!(f|n|r|t|[u,U][\d,a-fA-F]{4}))/gm, '/');
  }

  return value;
};

export default function transformForSubmit(
  formConfig,
  form,
  retainViewFields = false,
) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(
      formConfig,
      form,
      stringifyFormReplacer,
      retainViewFields,
    ),
  );

  return JSON.stringify(
    { ...transformedData, formNumber: formConfig.formId },
    escapedCharacterReplacer,
  );
}
