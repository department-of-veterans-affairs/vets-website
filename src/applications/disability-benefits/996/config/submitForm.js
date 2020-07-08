import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import recordEvent from 'platform/monitoring/record-event';

const submitForm = (form, formConfig, { mode } = {}) => {
  const { submitUrl, trackingPrefix } = formConfig;
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);

  // event data needed on successful submission
  const { sameOffice, informalConference } = form.data;
  let informalConf = 'no';
  if (informalConference !== 'no') {
    informalConf = informalConference === 'rep' ? 'yes-with-rep' : 'yes';
  }
  const eventData = {
    // or 'no'
    'decision-reviews-differentOffice': sameOffice ? 'yes' : 'no',
    // or 'no', or 'yes-with-rep'
    'decision-reviews-informalConf': informalConf,
  };
  // Submission attempt event
  recordEvent({
    event: `${trackingPrefix}-submission`,
    ...eventData,
  });
  return submitToUrl(body, submitUrl, trackingPrefix, eventData).catch(() => {
    recordEvent({
      event: `${trackingPrefix}-submission-failure`,
      ...eventData,
    });
  });
};

export default submitForm;
