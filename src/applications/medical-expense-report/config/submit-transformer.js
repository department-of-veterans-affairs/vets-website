import { format } from 'date-fns-tz';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

function swapNames(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  if (
    parsedFormData?.claimantNotVeteran === false &&
    parsedFormData.claimantFullName?.first &&
    parsedFormData.claimantFullName?.last &&
    !parsedFormData.veteranFullName?.first &&
    !parsedFormData.veteranFullName?.last
  ) {
    transformedValue.veteranFullName = {};
    transformedValue.veteranFullName.first =
      parsedFormData.claimantFullName?.first;
    transformedValue.veteranFullName.middle =
      parsedFormData.claimantFullName?.middle;
    transformedValue.veteranFullName.last =
      parsedFormData.claimantFullName?.last;
    transformedValue.veteranFullName.suffix =
      parsedFormData.claimantFullName?.suffix;
    transformedValue.claimantFullName = {};
  }
  return JSON.stringify(transformedValue);
}

export const transform = (formConfig, form) => {
  let transformedData = transformForSubmit(formConfig, form);
  transformedData = swapNames(transformedData);
  return JSON.stringify({
    medicalExpenseReportsClaim: {
      form: transformedData,
    },
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
};
