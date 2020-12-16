import { useState, useCallback } from 'react';
import { requestStates } from 'platform/utilities/constants';

import { saveForm } from '../api';

export default function useSubmitForm() {
  const [status, setSubmitStatus] = useState(requestStates.notCalled);

  const submit = useCallback(formData => {
    async function sendToApi() {
      const normalized = {
        ...formData,
        zipCodeDetails: formData.locationDetails,
      };
      try {
        await saveForm(normalized);
        setSubmitStatus(requestStates.succeeded);
      } catch (error) {
        setSubmitStatus(requestStates.failed);
      }
    }

    setSubmitStatus(requestStates.pending);
    sendToApi();
  });

  return [status, submit];
}
