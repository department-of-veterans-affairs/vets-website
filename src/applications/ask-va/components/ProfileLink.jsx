import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

const ProfileLink = ({ loggedIn }) => {
  return loggedIn ? (
    <div className="vads-u-margin-top--2 vads-u-margin-bottom--4">
      <p>
        Updates you make here will only apply to this form. To update your
        contact information for all your VA accounts, sign in to your profile.
      </p>
      <Link to="/profile">Update your contact information online</Link>
    </div>
  ) : (
    ''
  );
};

ProfileLink.propTypes = {
  loggedIn: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
  };
}

export default connect(mapStateToProps)(ProfileLink);
