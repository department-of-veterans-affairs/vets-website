import { submitToUrl } from 'platform/forms-system/src/js/actions';
/*
function createSamplePromise() {
  return new Promise(resolve => {
    const customPromiseResult = {
      status: 'success',
      data: {
        id: 'OP43nlICrRkYOnopH6VG',
        type: 'preneeds_receive_applications',
        attributes: {
          receiveApplicationId: 'OP43nlICrRkYOnopH6VG',
          trackingNumber: 'OP43nlICrRkYOnopH6VG',
          returnCode: 0,
          applicationUuid: '405ae576-eace-4003-9ee4-3e3b531fdd97',
          returnDescription: ' PreNeed Application Received Successfully.',
          submittedAt: '2023-07-18T18:04:50.948Z',
        },
      },
    };
    resolve(customPromiseResult); // Always resolve the Promise with the custom result
  });
}
*/
const sampleEventData = () => {
  return {
    status: 'success',
    data: {
      id: 'OP43nlICrRkYOnopH6VG',
      type: 'preneeds_receive_applications',
      attributes: {
        receiveApplicationId: 'OP43nlICrRkYOnopH6VG',
        trackingNumber: 'OP43nlICrRkYOnopH6VG',
        returnCode: 0,
        applicationUuid: '405ae576-eace-4003-9ee4-3e3b531fdd97',
        returnDescription: ' PreNeed Application Received Successfully.',
        submittedAt: '2023-07-18T18:04:50.948Z',
      },
    },
  };
};

const submitForm = (form, formConfig) => {
  const body = formConfig.transformForSubmit(formConfig, form);
  return submitToUrl(
    body,
    formConfig.submitUrl,
    formConfig.trackingPrefix,
    sampleEventData(),
  );
};

export default submitForm;
