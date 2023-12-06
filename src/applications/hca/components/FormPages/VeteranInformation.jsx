import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import AuthProfileInformation from '../VeteranInformation/AuthProfileInformation';
import GuestVerifiedInformation from '../VeteranInformation/GuestVerifiedInformation';

const VeteranInformation = props => {
  const {
    data,
    user,
    goBack,
    goForward,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  return (
    <>
      {data['view:isLoggedIn'] ? (
        <AuthProfileInformation user={user} />
      ) : (
        <GuestVerifiedInformation user={data['view:veteranInformation']} />
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
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.user.profile,
});

export default connect(mapStateToProps)(VeteranInformation);
