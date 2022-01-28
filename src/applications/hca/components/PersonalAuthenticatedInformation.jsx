import React from 'react';
import { connect } from 'react-redux';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

const PersonalAuthenticatedInformation = ({
  data,
  goBack,
  goForward,
  isLoggedIn,
}) => {
  const navButtons = <FormNavButtons goBack={goBack} goForward={goForward} />;
  return (
    <div>
      {isLoggedIn && (
        <div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <p>Logged In</p>
        </div>
      )}
      {navButtons}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
    user: state.user.profile,
    data: state.form.data,
  };
};

export default connect(mapStateToProps)(PersonalAuthenticatedInformation);
