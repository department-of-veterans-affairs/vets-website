import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import AuthProfileInformation from '../VeteranInformation/AuthProfileInformation';
import GuestVerifiedInformation from '../VeteranInformation/GuestVerifiedInformation';

const VeteranInformation = props => {
  const {
    data,
    goBack,
    goForward,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;
  const { userFullName, dob } = useSelector(state => state.user.profile);
  const authUser = {
    veteranFullName: userFullName,
    veteranDateOfBirth: dob,
    totalDisabilityRating: data['view:totalDisabilityRating'],
  };
  const guestUser = data['view:veteranInformation'];

  return (
    <>
      {data['view:isLoggedIn'] ? (
        <AuthProfileInformation user={authUser} />
      ) : (
        <GuestVerifiedInformation user={guestUser} />
      )}
      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} goForward={goForward} />
      {contentAfterButtons}
    </>
  );
};

VeteranInformation.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default VeteranInformation;
