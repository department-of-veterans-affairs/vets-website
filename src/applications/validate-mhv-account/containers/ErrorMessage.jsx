import React from 'react';
import PropTypes from 'prop-types';
import GenericError from '../components/GenericError';
import MultipleMHVIds from '../components/MultipleMHVIds';
import DeactivatedMHVId from '../components/DeactivatedMHVId';
import NeedsSSNResolution from '../components/NeedsSSNResolution';
import NeedsVAPatient from '../components/NeedsVAPatient';

const ErrorMessage = ({ params }) => {
  const errorCode = params.errorCode;

  switch (errorCode) {
    case 'has-deactivated-mhv-ids':
      return <DeactivatedMHVId />;
    case 'has-multiple-active-mhv-ids':
      return <MultipleMHVIds />;
    case 'needs-ssn-resolution':
      return <NeedsSSNResolution />;
    case 'needs-va-patient':
      return <NeedsVAPatient />;
    case 'register-failed':
    case 'upgrade-failed':
    default:
      return <GenericError />;
  }
};

ErrorMessage.propTypes = {
  params: PropTypes.object,
};

export default ErrorMessage;
