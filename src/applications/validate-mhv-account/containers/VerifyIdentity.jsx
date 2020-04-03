import React from 'react';
import { connect } from 'react-redux';

import MessageTemplate from './../components/MessageTemplate';

import { ssoe } from 'platform/user/authentication/selectors';
import { verify } from 'platform/user/authentication/utilities';

export function VerifyIdentity({ useSSOe }) {
  const authVersion = useSSOe ? 'v1' : 'v0';
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
          onClick={() => verify(authVersion)}
          className="usa-button-primary va-button-primary"
        >
          Verify your identity
        </button>
      </>
    ),
  };

  return <MessageTemplate content={content} />;
}

function mapStateToProps(state) {
  return {
    useSSOe: ssoe(state),
  };
}

export default connect(mapStateToProps)(VerifyIdentity);
