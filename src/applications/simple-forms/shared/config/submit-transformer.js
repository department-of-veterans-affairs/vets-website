import { transformForSubmit as formsSystemTransformForSubmit } from '@department-of-veterans-affairs/platform-forms-system';

const escapedCharacterReplacer = (_key, value) => {
  if (typeof value === 'string') {
    return (
      value
        .replaceAll('"', "'")
        .replace(/(?:\r\n|\n\n|\r|\n)/g, '; ')
        .replace(/(?:\t|\f|\b)/g, '')
        /* eslint-disable-next-line no-control-regex */
        .replace(/([^\x00-\x7F])/g, '')
        .replaceAll('\\', '/')
    );
  }

  return value;
};

/**
 * Example:
 * ```
 * transformForSubmit(formConfig, form);
 * transformForSubmit(formConfig, form, {
 *   allowPartialAddress: true,
 * });
 * ```
 *
 * @param formConfig
 * @param form
 * @param [options]
 */
export default function transformForSubmit(formConfig, form, options) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form, options),
  );

  return JSON.stringify(
    { ...transformedData, formNumber: formConfig.formId },
    escapedCharacterReplacer,
  );
}
