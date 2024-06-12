import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrefilledAddress = props => {
  const { isLoggedIn } = props;
  return isLoggedIn ? (
    <div>
      <p>
        Any updates you make here to the contact information will only apply to
        this form. If you want to update your contact information for all your
        VA accounts,{' '}
        <a href="https://va.gov/profile/contact-information">
          please go to your profile page.
        </a>
      </p>
    </div>
  ) : (
    <div />
  );
};

PrefilledAddress.propTypes = {
  isLoggedIn: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
  };
};

export default connect(mapStateToProps)(PrefilledAddress);
