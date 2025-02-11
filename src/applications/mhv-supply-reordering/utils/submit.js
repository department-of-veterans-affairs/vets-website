import { submitToUrl } from '~/platform/forms-system/src/js/actions';

const submit = (form, formConfig) => {
  const { data } = form;
  const { submitUrl, trackingPrefix, transformForSubmit } = formConfig;

  const params = transformForSubmit(data);
  const productIdsCount = params.order.length;
  const body = JSON.stringify(params);

  return submitToUrl(body, submitUrl, trackingPrefix, { productIdsCount });

  // todo: create reducer, watch for 'SET_SUBMITTED' action, report result to analytics
};

export default submit;
