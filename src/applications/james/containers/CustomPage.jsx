import React from 'react';
import { connect } from 'react-redux';

const CustomPage = props => {
  const { isLoggedIn } = props;

  if (isLoggedIn) {
    return (
      <div className="schemaform-intro">
        <h1>Hello, logged in user!</h1>
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
  };
};

export default connect(mapStateToProps)(CustomPage);
