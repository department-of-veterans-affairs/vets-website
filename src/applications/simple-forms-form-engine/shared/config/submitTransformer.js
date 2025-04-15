import { transformForSubmit as platformTransformForSubmit } from 'platform/forms-system/exportsFile';

/**
 * @param formConfig {FormConfig}
 * @param form {Object}
 * @returns {string} The transformed form data as a JSON string
 */
const transformForSubmit = (formConfig, form) => {
  // We need the form number to send it to the right model
  const formData = {
    ...form.data,
    formNumber: formConfig.formId,
  };

  /** @type {ReplacerOptions} */
  const options = { replaceEscapedCharacters: true };

  return platformTransformForSubmit(
    formConfig,
    {
      ...form,
      data: formData,
    },
    options,
  );
};

export default transformForSubmit;
