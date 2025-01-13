import { apiRequest } from '~/platform/utilities/api';
import analyticsFn from './analytics';

const submit = (form, formConfig, analytics = analyticsFn) => {
  const { data } = form;
  const { submitUrl, trackingPrefix, transformForSubmit } = formConfig;

  const params = transformForSubmit(data);
  const productIdsCount = params.order.length;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return apiRequest(submitUrl, options)
    .then(resource => {
      analytics({ ok: true, resource, productIdsCount, trackingPrefix });
      return resource;
    })
    .catch(error => {
      analytics({ ok: false, productIdsCount, trackingPrefix });
      return Promise.reject(error);
    });
};

export default submit;
