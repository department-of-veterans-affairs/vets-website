import {
  replaceEscapedCharacters,
  transformForSubmit as formsSystemTransformForSubmit,
} from 'platform/forms-system/src/js/helpers';

const escapedCharacterReplacer = (_key, value) => {
  if (typeof value === 'string') {
    return replaceEscapedCharacters(value);
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
