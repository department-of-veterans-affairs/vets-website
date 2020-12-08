import { useState, useCallback } from 'react';

import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { requestStates } from 'platform/utilities/constants';

const apiUrl = `${environment.API_URL}/covid_vaccine/v0/registration`;
const unauthenticatedApiUrl = `${apiUrl}/unauthenticated`;

export default function useSubmitForm() {
  const [status, setSubmitStatus] = useState(requestStates.notCalled);

  const submit = useCallback(formData => {
    async function sendToApi() {
      const submissionUrl = formData.isIdentityVerified
        ? apiUrl
        : unauthenticatedApiUrl;

      try {
        await apiRequest(submissionUrl, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
          },
        });

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
