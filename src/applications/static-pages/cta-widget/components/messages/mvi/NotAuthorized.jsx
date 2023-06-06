import React from 'react';

import CallToActionAlert from '../../CallToActionAlert';

function NotAuthorized() {
  const content = {
    heading: 'Verify your identity to access more VA.gov tools and features',
    alertText: (
      <>
        <p>
          When you verify your identity, you can use VA.gov to do things like
          track your claims, refill your prescriptions, and download your VA
          benefit letters.
        </p>
        <a href="/verify">Verify Your Identity</a>
        <p>
          <a href="/resources/verifying-your-identity-on-vagov/">
            Learn about how to verify your identity
          </a>
        </p>
      </>
    ),
    status: 'info',
  };

  return <CallToActionAlert {...content} />;
}

export default NotAuthorized;
