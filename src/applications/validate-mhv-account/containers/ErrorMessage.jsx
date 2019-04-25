import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  createAndUpgradeMHVAccount,
  upgradeMHVAccount,
} from '../../../platform/user/profile/actions';

import GenericError from '../components/errors/GenericError';
import MultipleMHVIds from '../components/errors/MultipleMHVIds';
import DeactivatedMHVId from '../components/errors/DeactivatedMHVId';
import VerificationFailed from '../components/errors/VerificationFailed';
import NeedsVAPatient from '../components/errors/NeedsVAPatient';
import CreateAccountFailed from '../components/errors/CreateAccountFailed';
import UpgradeAccountFailed from '../components/errors/UpgradeAccountFailed';

class ErrorMessage extends React.Component {
  render() {
    const { params } = this.props;
    const errorCode = params.errorCode;

    // Render error messaging based on code
    switch (errorCode) {
      case 'has-deactivated-mhv-ids':
        return <DeactivatedMHVId />;
      case 'has-multiple-active-mhv-ids':
        return <MultipleMHVIds />;
      case 'needs-ssn-resolution':
        return <VerificationFailed />;
      case 'needs-va-patient':
        return <NeedsVAPatient />;
      case 'register-failed':
        return <CreateAccountFailed />;
      case 'upgrade-failed':
        return (
          <UpgradeAccountFailed upgradeAccount={this.props.upgradeMHVAccount} />
        );
      default:
        return <GenericError />;
    }
  }
}

ErrorMessage.propTypes = {
  params: PropTypes.object,
  upgradeMHVAccount: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  createAndUpgradeMHVAccount,
  upgradeMHVAccount,
};

export default connect(
  null,
  mapDispatchToProps,
)(ErrorMessage);
