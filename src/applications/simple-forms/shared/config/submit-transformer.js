import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

const escapedCharacterReplacer = (_key, value) => {
  if (typeof value === 'string') {
    return value
      .replaceAll('"', "'")
      .replace(/(?:\r\n|\n\n|\r|\n)/g, '; ')
      .replace(/(?:\t|\f|\b)/g, '')
      .replace(/[\u{0080}-\u{FFFF}]/gu,'')
      .replaceAll('\\', '/');
  }

  return value;
};

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  return JSON.stringify(
    { ...transformedData, formNumber: formConfig.formId },
    escapedCharacterReplacer,
  );
}
