import React, { useEffect, useState } from 'react';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import { parseRedirectUrl, touStyles } from '../helpers';

const redirectUserToErrorPage = () => {
  setTimeout(() => {
    window.history.pushState(
      {},
      '',
      '/auth/login/callback/?auth=fail&code=110',
    );
    window.history.go();
  }, 3000);
};

export default function MyVAHealth() {
  const [{ hasError, retriesExhausted, message }, setError] = useState({
    hasError: false,
    message: 'Provisioning your acount...',
    retriesExhausted: false,
  });
  const url = new URL(window.location);
  const ssoeTarget = url.searchParams.get('ssoeTarget');

  useEffect(
    () => {
      if (ssoeTarget) {
        apiRequest(`/terms_of_use_agreements/update_provisioning`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          retryOn: (attempt, error, response) => {
            if ((error !== null || response.status >= 400) && attempt < 3) {
              setError({
                hasError: true,
                message: 'Retrying account provisioning...',
              });
              return true;
            }
            setError({
              hasError: true,
              message: 'Account provision failed',
              retriesExhausted: true,
            });
            return false;
          },
        }).then(response => {
          if (response?.provisioned) {
            const returnUrl = parseRedirectUrl(decodeURIComponent(ssoeTarget));
            window.location = returnUrl;
          }
        });
      }
    },
    [ssoeTarget],
  );

  useEffect(
    () => {
      if (hasError && retriesExhausted) redirectUserToErrorPage();
    },
    [hasError, retriesExhausted],
  );

  return (
    <div className="vads-u-margin-y--2">
      <style>{touStyles}</style>
      <va-loading-indicator set-focus message={message} />
    </div>
  );
}
