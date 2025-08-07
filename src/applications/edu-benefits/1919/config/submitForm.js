import { submitToUrl } from 'platform/forms-system/src/js/actions';
// import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

const submitForm = (form, formConfig) => {
  const body = formConfig.transformForSubmit(formConfig, form);
  // console.log('form.data', form.data);
  // const transformedData =  transformForSubmit(formConfig, { ...form, data: form.data });

  //     const body = JSON.stringify({
  //     educationBenefitsClaim: {
  //       form: transformedData,
  //     },
  //   });

  // console.log('body', body);

  return submitToUrl(
    body,
    formConfig.submitUrl,
    formConfig.trackingPrefix,
    // buildSubmitEventData(form.data),
  );
};
export default submitForm;
