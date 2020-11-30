import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export const buildEventData = ({ sameOffice, informalConference }) => {
  let informalConf = 'no';
  if (informalConference !== 'no') {
    informalConf = informalConference === 'rep' ? 'yes-with-rep' : 'yes';
  }
  return {
    // or 'no'
    'decision-reviews-same-office-to-review': sameOffice ? 'yes' : 'no',
    // or 'no', or 'yes-with-rep'
    'decision-reviews-informalConf': informalConf,
  };
};

const submitForm = (form, formConfig) => {
  const { submitUrl, trackingPrefix } = formConfig;
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);

  // eventData for analytics
  const eventData = buildEventData(form.data);
  return submitToUrl(body, submitUrl, trackingPrefix, eventData);
};

export default submitForm;
