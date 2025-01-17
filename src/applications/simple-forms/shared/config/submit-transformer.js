import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

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
    formsSystemTransformForSubmit(formConfig, form, {
      ...options,
      replaceEscapedCharacters: true,
    }),
  );

  return JSON.stringify({ ...transformedData, formNumber: formConfig.formId });
}
