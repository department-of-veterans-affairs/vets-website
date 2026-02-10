import { cloneDeep, isNil } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transform(formConfig, form) {
  const statementAndAuthTransform = formData => {
    const clonedData = cloneDeep(formData);
    delete clonedData.statementOfTruthCertified;

    if (isNil(clonedData.isAuthenticated)) {
      clonedData.isAuthenticated =
        JSON.parse(localStorage.getItem('hasSession')) ?? false;
    }

    return clonedData;
  };

  const dateTransform = formData => {
    const clonedData = cloneDeep(formData);

    const date = new Date();
    const offset = date.getTimezoneOffset();
    const today = new Date(date.getTime() - offset * 60 * 1000);
    const [todaysDate] = today.toISOString().split('T');
    clonedData.dateSigned = todaysDate;
    return clonedData;
  };

  const usFormTransform = formData =>
    transformForSubmit(
      formConfig,
      { ...form, data: formData },
      // { allowPartialAddress: true },
    );

  const transformedData = [
    statementAndAuthTransform,
    dateTransform,
    usFormTransform, // this must appear last
  ].reduce((formData, transformer) => {
    return transformer(formData);
  }, form.data);

  // console.log('transformedData', transformedData);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
