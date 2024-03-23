import {
  VaAlert,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { ServerErrorAlert } from '../config/helpers';

const ProfileTest = ({ loggedIn }) => {
  const [error, hasError] = useState(false);
  const [userProfile, setUserProfile] = useState({});

  const getData = async () => {
    const PROFILE_DATA = `${environment.API_URL}/ask_va_api/v0/static_data`;

    const response = await apiRequest(PROFILE_DATA)
      .then(res => {
        return res;
      })
      .catch(() => {
        hasError(true);
      });
    setUserProfile(response);
  };

  useEffect(() => {
    getData();
  }, []);

  return !error && loggedIn ? (
    <div>
      {Object.entries(userProfile.data).map(([key, value]) => (
        <div key={key}>
          {key} : {value}
        </div>
      ))}
    </div>
  ) : (
    <VaAlert status="info" className="row vads-u-margin-y--4">
      <ServerErrorAlert />
      <Link aria-label="Go sign in" to="/contact-us/ask-va-too/introduction">
        <VaButton
          onClick={() => {}}
          primary
          text="Sign in with Approved User"
        />
      </Link>
    </VaAlert>
  );
};

ProfileTest.propTypes = {
  loggedIn: PropTypes.bool,
  params: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
  };
}

export default connect(mapStateToProps)(ProfileTest);
