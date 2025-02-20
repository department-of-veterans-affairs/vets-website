import environment from 'platform/utilities/environment';
import { submitToUrl } from 'platform/forms-system/src/js/actions';

export const buildEventData = formData => {
  const { informalConference, informalConferenceChoice } = formData;
  let informalConf = 'no';
  if (informalConferenceChoice && informalConference !== 'no') {
    informalConf = informalConference === 'rep' ? 'yes-with-rep' : 'yes';
  }
  return {
    // 'yes', 'no', or 'yes-with-rep'
    'decision-reviews-informalConf': informalConf,
  };
};

const submitForm = (form, formConfig) => {
  const { submitUrl, trackingPrefix } = formConfig;
  const body = formConfig.transformForSubmit(formConfig, form);

  const url = `${environment.API_URL}${submitUrl}`;

  // eventData for analytics
  const eventData = buildEventData(form.data);
  return submitToUrl(body, url, trackingPrefix, eventData);
};

export default submitForm;
