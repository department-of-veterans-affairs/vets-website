import { useState, useCallback } from 'react';
import { requestStates } from 'platform/utilities/constants';

import { saveForm } from '../api';
import useRecaptcha from './useRecaptcha';

export default function useSubmitForm() {
  const [status, setSubmitStatus] = useState(requestStates.notCalled);
  const [executeRecaptcha] = useRecaptcha();
  const appActionID = 'coronavirus_vaccine_submit';

  const submit = useCallback(formData => {
    async function sendToApi(token) {
      const normalized = {
        ...formData,
        zipCodeDetails: formData.locationDetails,
        recaptchaToken: formData.isIdentityVerified ? null : token,
      };

      try {
        await saveForm(normalized);
        setSubmitStatus(requestStates.succeeded);
      } catch (error) {
        setSubmitStatus(requestStates.failed);
      }
    }
    if (!formData.isIdentityVerified) {
      executeRecaptcha(sendToApi, appActionID);
    } else {
      sendToApi();
    }
    setSubmitStatus(requestStates.pending);
  });

  return [status, submit];
}
