import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MessageTemplate from '../components/MessageTemplate';

import { upgradeMHVAccount } from 'platform/user/profile/actions';

function UpgradeMHVAccount(props) {
  const content = {
    heading: `Please upgrade your My HealtheVet account`,
    body: (
      <>
        <p>It'll only take us a minute to do this for you. And it's free.</p>

        <button
          onClick={props.upgradeMHVAccount}
          className="usa-button-primary va-button-primary"
        >
          Upgrade your My HealtheVet account
        </button>
      </>
    ),
  };

  return <MessageTemplate content={content} />;
}

UpgradeMHVAccount.propTypes = {
  upgradeMHVAccount: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  upgradeMHVAccount,
};

export default connect(
  null,
  mapDispatchToProps,
)(UpgradeMHVAccount);
