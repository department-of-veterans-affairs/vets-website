/* eslint-disable no-prototype-builtins */
import sharedTransformForSubmit from '../../shared/config/submit-transformer';

export default function transformForSubmit(formConfig, form) {
  const remarksFormData = form.data.remarks;
  const remarksUiSchema =
    formConfig.chapters.additionalInformationChapter.pages.remarks.uiSchema;

  let remarkString = '';

  function appendRemarksString(key, data, uiSchema) {
    // filters by 'truthy' values, so non-empty strings and 'true' checkboxes
    if (data[key]) {
      // 'true' checkboxes add their ui:title
      // non-empty strings add their string content
      remarkString +=
        data[key] === true
          ? `${uiSchema[key]['ui:title']}; `
          : `${data[key]}; `;
    }
  }

  Object.keys(remarksFormData).forEach(remarkKey => {
    appendRemarksString(remarkKey, remarksFormData, remarksUiSchema.remarks);
  });
  appendRemarksString('otherConditions', form.data, remarksUiSchema);

  // removes final '; ' and trims whitespace
  remarkString = remarkString.slice(0, remarkString.length - 2).trim();

  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form, {
      allowPartialAddress: true,
    }),
  );

  // otherConditions is combined into remarks string, so remove from transformedData
  if (transformedData.hasOwnProperty('otherConditions')) {
    delete transformedData.otherConditions;
  }

  if (remarkString === '') {
    delete transformedData.remarks;

    return JSON.stringify(transformedData);
  }

  return JSON.stringify({ ...transformedData, remarks: remarkString });
}
