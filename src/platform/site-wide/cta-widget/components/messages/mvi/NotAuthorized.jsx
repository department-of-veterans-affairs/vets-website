import React from 'react';
import { connect } from 'react-redux';

import CallToActionAlert from '../../CallToActionAlert';

import { ssoe } from 'platform/user/authentication/selectors';
import { verify } from 'platform/user/authentication/utilities';

export class NotAuthorized extends React.Component {
  verifyHandler() {
    verify(this.props.useSSOe ? 'v1' : 'v0');
  }

  render() {
    const content = {
      heading: 'Verify your identity to access more VA.gov tools and features',
      alertText: (
        <>
          <p>
            When you verify your identity, you can use VA.gov to do things like
            track your claims, refill your prescriptions, and download your VA
            benefit letters.
          </p>
          <button className="usa-button-primary" onClick={this.verifyHandler}>
            Verify Your Identity
          </button>
          <p>
            <a href="/sign-in-faq/#how-to-verify">
              Learn about how to verify your identity
            </a>
          </p>
        </>
      ),
      status: 'info',
    };

    return <CallToActionAlert {...content} />;
  }
}

function mapStateToProps(state) {
  return {
    useSSOe: ssoe(state),
  };
}

export default connect(mapStateToProps)(NotAuthorized);
