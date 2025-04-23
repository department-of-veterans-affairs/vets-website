import { submitToUrl } from '~/platform/forms-system/src/js/actions';

const submit = (form, formConfig) => {
  const { data } = form;
  const { submitUrl, trackingPrefix, transformForSubmit } = formConfig;

  const params = transformForSubmit(data);
  const productIdsCount = params.order.length;
  const body = JSON.stringify(params);

  return submitToUrl(body, submitUrl, trackingPrefix, { productIdsCount });
  // Attempting to report to analytics via .then().catch() isn't working quite right.
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

  // todo: create reducer, watch for 'SET_SUBMITTED' action, report result to analytics
};

export default submit;
