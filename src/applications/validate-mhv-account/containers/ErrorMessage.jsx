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
import { MVI_ERROR_STATES } from 'platform/monitoring/RequiresMVI/constants';

export default function ErrorMessage({ params }) {
  let errorCode = params.errorCode
    ? params.errorCode.replace(/-/g, '_')
    : undefined;

  // Capitalize in case of mvi error
  if (errorCode?.startsWith('mvi_error')) {
    errorCode = errorCode.replace('mvi_error_', '').toUpperCase();
  }

  // Render error messaging based on code
  switch (errorCode) {
    case MVI_ERROR_STATES.NOT_FOUND:
      return <NeedsSSNResolution />;
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

ErrorMessage.propTypes = {
  params: PropTypes.object,
};
