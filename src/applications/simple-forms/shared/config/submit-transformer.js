import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';
import { cloneDeep } from 'lodash';

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
  const formData = cloneDeep(form.data);

  // remove all view: fields
  Object.keys(formData)
    .filter(key => key.startsWith('view:'))
    .forEach(key => delete formData[key]);

  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(
      formConfig,
      { ...form, data: formData },
      {
        ...options,
        replaceEscapedCharacters: true,
      },
    ),
  );

  return JSON.stringify({ ...transformedData, formNumber: formConfig.formId });
}
