import React from 'react';
import PropTypes from 'prop-types';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import { SingleFieldLoadFailAlert } from '../alerts/LoadFail';

const MessagingSignature = props => {
  const { hasError, fieldName, signaturePresent } = props;
  return hasError ? (
    <SingleFieldLoadFailAlert sectionName="signature information" />
  ) : (
    <ProfileInformationFieldController
      fieldName={fieldName}
      isDeleteDisabled={!signaturePresent}
    />
  );
};

MessagingSignature.propTypes = {
  fieldName: PropTypes.string.isRequired,
  hasError: PropTypes.bool,
  signaturePresent: PropTypes.bool,
};

export default MessagingSignature;
