import sharedTransformForSubmit from '../../shared/config/submit-transformer';

export default function transformForSubmit(formConfig, form) {
  const remarksFormData = form.data.remarks;
  const remarksUiSchema =
    formConfig.chapters.additionalInformationChapter.pages.remarks.uiSchema
      .remarks;

  let remarkString = '';

  Object.keys(remarksFormData).forEach(remarkKey => {
    // filters by 'truthy' values, so non-empty strings and 'true' checkboxes
    if (remarksFormData[remarkKey]) {
      // 'true' checkboxes add their ui:title
      // non-empty strings add their string content
      remarkString +=
        remarksFormData[remarkKey] === true
          ? `${remarksUiSchema[remarkKey]['ui:title']}; `
          : `${remarksFormData[remarkKey]}; `;
    }
  });

  // removes final '; ' and trims whitespace
  remarkString = remarkString.slice(0, remarkString.length - 2).trim();

  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );

  if (remarkString === '') {
    delete transformedData.remarks;

    return JSON.stringify(transformedData);
  }

  return JSON.stringify({ ...transformedData, remarks: remarkString });
}
