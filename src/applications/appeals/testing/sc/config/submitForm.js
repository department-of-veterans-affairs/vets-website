// import environment from 'platform/utilities/environment';
// import { submitToUrl } from 'platform/forms-system/src/js/actions';
// import { transform } from './submit-transformer';

// Analytics event
// export const buildEventData = () => {};

const submitForm = (/* form, formConfig */) => {
  // const { submitUrl, trackingPrefix } = formConfig;
  // const body = transform(formConfig, form);

  // const url = `${environment.API_URL}${submitUrl}`;

  // // eventData for analytics
  // const eventData = buildEventData(form.data);
  // return submitToUrl(body, url, trackingPrefix, eventData);
  return new Promise(resolve => setTimeout(() => resolve({}), 1000));
};

export default submitForm;
