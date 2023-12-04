import React from 'react';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

const ProfileLink = ({ loggedIn }) => {
  return loggedIn ? (
    <div className="vads-u-margin-top--2 vads-u-margin-bottom--4">
      <p>
        Updates you make here <strong>will only apply to this form</strong>. To
        update your contact information for all your VA accounts, please go to
        your profile page
      </p>
      <Link to="/profile">
        Go to your profile page to update your contact information
      </Link>
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
