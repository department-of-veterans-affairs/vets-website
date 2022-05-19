import moment from 'moment';

import {
  WIZARD_STATUS_COMPLETE,
  WIZARD_STATUS_RESTARTING,
} from 'platform/site-wide/wizard';

import { WIZARD_STATUS } from '../constants';

export const getHlrWizardStatus = () => sessionStorage.getItem(WIZARD_STATUS);
export const setHlrWizardStatus = status =>
  sessionStorage.setItem(WIZARD_STATUS, status);
export const removeHlrWizardStatus = () =>
  sessionStorage.removeItem(WIZARD_STATUS);

export const shouldShowWizard = (formId, savedForms = []) => {
  const wizardStatus = getHlrWizardStatus();
  const hasSavedForm = savedForms.some(
    form =>
      // expiresAt: Ruby saves as time from Epoch date in seconds (not ms)
      form.form === formId && moment.unix(form.metaData?.expiresAt).isAfter(),
  );
  return (
    (!hasSavedForm && wizardStatus !== WIZARD_STATUS_COMPLETE) ||
    (hasSavedForm && wizardStatus === WIZARD_STATUS_RESTARTING)
  );
};
