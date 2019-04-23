import React from 'react';
import { connect } from 'react-redux';
import { logout } from '../../../platform/user/authentication/utilities';
import MessageTemplate from './../components/MessageTemplate';

import {
  createAndUpgradeMHVAccount,
  // upgradeMHVAccount,
} from '../../../platform/user/profile/actions';

const CreateMHVAccount = () => {
  const content = {
    heading: `Please create a My HealtheVet account to access health tools  `,
    body: (
      <>
        <p>
          You’ll need to create a My HealtheVet account before you can access
          our health tools online. This account is cost-free and secure.
        </p>
        <p>
          <strong>If you already have a My HealtheVet account,</strong> please
          sign out of VA.gov. Then sign in again with your My HealtheVet
          username and password.
        </p>

        <button
          onClick={this.props.createAndUpgradeMHVAccount}
          className="usa-button-primary va-button-primary"
        >
          Create your free account
        </button>
        <button
          className="va-button-link vads-u-margin-left--2"
          onClick={logout}
        >
          Sign out of VA.gov
        </button>
      </>
    ),
  };

  return <MessageTemplate content={content} />;
};

CreateMHVAccount.propTypes = {};
const mapDispatchToProps = {
  createAndUpgradeMHVAccount,
  // toggleLoginModal,
  // upgradeMHVAccount,
};

export default connect(
  {},
  mapDispatchToProps,
)(CreateMHVAccount);
