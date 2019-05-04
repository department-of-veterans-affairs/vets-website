import React from 'react';
import PropTypes from 'prop-types';

import GenericError from '../components/errors/GenericError';
import MultipleMHVIds from '../components/errors/MultipleMHVIds';
import DeactivatedMHVId from '../components/errors/DeactivatedMHVId';
import NeedsSSNResolution from '../components/errors/NeedsSSNResolution';
import NeedsVAPatient from '../components/errors/NeedsVAPatient';
import CreateMHVAccountFailed from './CreateMHVAccountFailed';
import UpgradeAccountFailed from './UpgradeAccountFailed';
import { ACCOUNT_STATES } from './../constants';

export default class ErrorMessage extends React.Component {
  render() {
    const { params } = this.props;

    // Replace hyphens with underscores to match ACCOUNT_STATES constants
    const errorCode = params.errorCode
      ? params.errorCode.replace(/-/g, '_')
      : '';

    // Render error messaging based on code
    switch (errorCode) {
      case ACCOUNT_STATES.DEACTIVATED_MHV_IDS:
        return <DeactivatedMHVId />;
      case ACCOUNT_STATES.MULTIPLE_IDS:
        return <MultipleMHVIds />;
      case ACCOUNT_STATES.NEEDS_SSN_RESOLUTION:
        return <NeedsSSNResolution />;
      case ACCOUNT_STATES.NEEDS_VA_PATIENT:
        return <NeedsVAPatient />;
      case ACCOUNT_STATES.REGISTER_FAILED:
        return <CreateMHVAccountFailed />;
      case ACCOUNT_STATES.UPGRADE_FAILED:
        return <UpgradeAccountFailed />;
      default:
        return <GenericError />;
    }
  }
}

ErrorMessage.propTypes = {
  params: PropTypes.object,
};
