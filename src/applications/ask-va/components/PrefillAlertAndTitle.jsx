import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const Title = () => (
  <>
    <legend className="schemaform-block-title">
      <h3 className="vads-u-color--gray-dark vads-u-margin-top--24">
        Your contact information
      </h3>
    </legend>
  </>
);

const PrefillAlertAndTitle = ({ loggedIn }) => {
  return loggedIn ? (
    <>
      <va-alert
        close-btn-aria-label="Close notification"
        status="info"
        uswds
        visible
      >
        <p className="vads-u-margin-y--0">
          We’ve prefilled some of your information from your account. If you
          need to correct anything, you can edit the form fields below.
        </p>
      </va-alert>
      <Title />
    </>
  ) : (
    <Title />
  );
};

PrefillAlertAndTitle.propTypes = {
  loggedIn: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
  };
}

export default connect(mapStateToProps)(PrefillAlertAndTitle);
