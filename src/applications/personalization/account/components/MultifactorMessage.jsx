import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ssoe } from '../../../../platform/user/authentication/selectors';
import { mfa } from '../../../../platform/user/authentication/utilities';
import recordEvent from '../../../../platform/monitoring/record-event';

export class MultifactorMessage extends React.Component {
  mfaHandler() {
    recordEvent({ event: 'multifactor-link-clicked' });
    mfa(this.props.useSSOe ? 'v1' : 'v0');
  }

  render() {
    if (this.props.multifactor) {
      return (
        <>
          <h3>Account security</h3>
          <p>
            <i className="fa fa-check-circle" /> You've added an extra layer of
            security to your account with 2-factor authentication.
          </p>
        </>
      );
    }

    return (
      <>
        <h4>Want to make your account more secure?</h4>
        <p>
          Add an extra layer of security (called 2-factor authentication). This
          helps to make sure only you can access your account—even if someone
          gets your password.
        </p>
        <button className="usa-button-primary" onClick={this.mfaHandler}>
          Set up 2-factor authentication
        </button>
      </>
    );
  }
}

MultifactorMessage.propTypes = {
  mulitfactor: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    useSSOe: ssoe(state),
  };
}

export default connect(mapStateToProps)(MultifactorMessage);
