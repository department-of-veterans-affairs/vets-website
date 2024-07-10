import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrefillCopy = props => {
  const { isLoggedIn } = props;
  return isLoggedIn ? (
    <div>
      <p>
        Any updates you make will only apply to this form. If you want to update
        your contact information for all your VA accounts,{' '}
        <a href="/profile/contact-information">
          please go to your profile page.
        </a>
      </p>
    </div>
  ) : (
    <div />
  );
};

PrefillCopy.propTypes = {
  isLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
  };
};

export default connect(mapStateToProps)(PrefillCopy);
