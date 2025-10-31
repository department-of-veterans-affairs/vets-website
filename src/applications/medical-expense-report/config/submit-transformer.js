import { format } from 'date-fns-tz';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

function swapNames(formData) {
  const transformedValue = formData;
  if (
    formData?.claimantNotVeteran === false &&
    formData.claimantFullName.first &&
    formData.claimantFullName.last &&
    !formData.veteranFullName?.first &&
    !formData.veteranFullName?.last
  ) {
    transformedValue.veteranFullName = {
      first: formData.claimantFullName.first,
      middle: formData.claimantFullName.middle,
      last: formData.claimantFullName.last,
      suffix: formData.claimantFullName.suffix,
    };
    transformedValue.claimantFullName = {
      first: undefined,
      middle: undefined,
      last: undefined,
      suffix: undefined,
    };
  }
  return transformedValue;
}

export const transform = (formConfig, form) => {
  let transformedData = JSON.parse(transformForSubmit(formConfig, form));
  transformedData = swapNames(transformedData);
  return JSON.stringify({
    medicalExpenseReportsClaim: {
      form: transformedData,
    },
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
};
