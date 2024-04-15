import React, { useEffect, useState } from 'react';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import { parseRedirectUrl } from '../helpers';
import { touStyles } from '../constants';

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
  const [message, setMessage] = useState('Provisioning your acount...');
  const url = new URL(window.location);
  const ssoeTarget = url.searchParams.get('ssoeTarget');

  useEffect(
    () => {
      if (ssoeTarget) {
        apiRequest(`/terms_of_use_agreements/update_provisioning`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
          .then(response => {
            if (response?.provisioned) {
              window.location = parseRedirectUrl(
                decodeURIComponent(ssoeTarget),
              );
            }
          })
          .catch(() => {
            setMessage(
              'There was an error provisioning your account. Redirecting...',
            );
            redirectUserToErrorPage();
          });
      }
    },
    [ssoeTarget],
  );

  return (
    <div className="vads-u-margin-y--2">
      <style>{touStyles}</style>
      <va-loading-indicator set-focus message={message} />
    </div>
  );
}
