import React from 'react';
import { connect } from 'react-redux';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

const VeteranNameDobPage = props => {
  const { isLoggedIn, profile, goBack, goForward } = props;
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = (
    <button type="submit" onClick={goForward}>
      Review update button
    </button>
  );

  if (isLoggedIn) {
    return (
      <div className="schemaform-intro">
        {navButtons}
        <h1>Hello, logged in user!</h1>
        <h3>props.isLoggedIn: '{props.isLoggedIn}'</h3>
        <h3>isLoggedIn: '{isLoggedIn}'</h3>
        <h2>profile: {profile}</h2>
        {updateButton}
      </div>
    );
  } else {
    return (
      <div className="schemaform-intro">
        <h1>Hello, logged out user!</h1>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
    userFullName: state.user.userFullName,
    userDob: state.user.dob,
    profile: state.user.profile,
  };
};

export default connect(mapStateToProps)(VeteranNameDobPage);
