import React from 'react';
import { connect } from 'react-redux';
// import localStorage from '~/platform/utilities/storage/localStorage';
import localStorage from 'platform/utilities/storage/localStorage';
// import veteranInformation from '../config/chapters/veteranInformation/personalnformation';
// import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

const VeteranNameDobPage = props => {
  // console.log('props: ', props);
  const firstName = localStorage.getItem('userFirstName');
  // console.log('firstName: ', firstName);
  const { isLoggedIn } = props;
  // console.log('props.isLoggedIn: ', props.isLoggedIn);
  // console.log('isLoggedIn: ', isLoggedIn);
  // const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;

  if (isLoggedIn) {
    return (
      <div className="schemaform-intro">
        <h1>Hello, logged in user {firstName}!</h1>
        <h3>props.isLoggedIn: '{props.isLoggedIn}'</h3>
        <h3>isLoggedIn: '{isLoggedIn}'</h3>
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
  };
};

export default connect(mapStateToProps)(VeteranNameDobPage);
