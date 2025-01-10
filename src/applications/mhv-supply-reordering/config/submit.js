import { apiRequest } from 'platform/utilities/api';
import { recordEventOnce as recordEventOnceFn } from '@department-of-veterans-affairs/platform-monitoring';

const submit = (form, formConfig, recordEventOnce = recordEventOnceFn) => {
  const { order, permanentAddress, vetEmail } = form.data;

  const params = {
    permanentAddress,
    vetEmail,
    order,
  };

  const method = 'POST';
  const body = JSON.stringify(params);
  const headers = {
    'Content-Type': 'application/json',
  };

  return apiRequest(formConfig.submitUrl, { method, body, headers })
    .then(response => {
      if (!response.ok) {
        throw new Error(response);
      }
      const event = `${formConfig.trackingPrefix}-submission-successful`;
      recordEventOnce({ event });
      return response.data.attributes;
    })
    .catch(error => {
      const event = `${formConfig.trackingPrefix}-submission-failure`;
      recordEventOnce({ event });
      return Promise.reject(error);
    });
};

export default submit;
