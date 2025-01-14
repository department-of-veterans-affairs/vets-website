// import { apiRequest } from '~/platform/utilities/api';
import { submitToUrl } from '~/platform/forms-system/src/js/actions';
import analyticsFn from './analytics';

const submit = (form, formConfig, analytics = analyticsFn) => {
  const { data } = form;
  const { submitUrl, trackingPrefix, transformForSubmit } = formConfig;

  const params = transformForSubmit(data);
  const productIdsCount = params.order.length;
  const body = JSON.stringify(params);

  // This implementation doesn't handle 4xx/5xx responses from the API

  // const options = {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(params),
  // };
  //
  // return apiRequest(submitUrl, options)
  //   .then(resource => {
  //     analytics({ ok: true, resource, productIdsCount, trackingPrefix });
  //     return resource;
  //   })
  //   .catch(error => {
  //     analytics({ ok: false, productIdsCount, trackingPrefix });
  //     return Promise.reject(error);
  //   });

  return submitToUrl(body, submitUrl, trackingPrefix, { productIdsCount })
    // .then(resource => {
    //   console.log({ resource });
    //   analytics({ ok: true, resource, productIdsCount, trackingPrefix });
    //   return resource;
    // })
    // .catch(error => {
    //   console.log({ error });
    //   analytics({ ok: false, productIdsCount, trackingPrefix });
    //   Promise.reject(error);
    // });
};

export default submit;
