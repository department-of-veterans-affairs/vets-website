import React from 'react';
import MessageTemplate from './../components/MessageTemplate';
import { verify } from '../../../platform/user/authentication/utilities';

const VerifyIdentity = () => {
  const content = {
    heading: 'Verify your identity to access health tools',
    body: (
      <>
        <p>
          We take your privacy seriously, and we’re committed to protecting your
          information. You’ll need to verify your identity before we can give
          you access to your personal health information.
        </p>
        <button
          onClick={verify}
          className="usa-button-primary va-button-primary"
        >
          Verify your identity
        </button>
      </>
    ),
  };

  return <MessageTemplate content={content} />;
};

export default VerifyIdentity;
