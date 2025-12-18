import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const Title = ({ title = '' }) => (
  <legend className="schemaform-block-title">
    <h3 className="vads-u-color--gray-dark vads-u-margin-top--24">
      {title || 'Your contact information'}
    </h3>
  </legend>
);

Title.propTypes = {
  title: PropTypes.string,
};

const PrefillAlertAndTitle = ({ loggedIn, title }) => {
  return loggedIn ? (
    <>
      <va-alert status="info" uswds visible>
        <p className="vads-u-margin-y--0">
          We’ve prefilled some of your information from your account. If you
          need to correct anything, you can edit the form fields below. Any
          updates you make here will only apply to this form.
        </p>
      </va-alert>
      <Title title={title} />
    </>
  ) : (
    <Title title={title} />
  );
};

PrefillAlertAndTitle.propTypes = {
  loggedIn: PropTypes.bool,
  title: PropTypes.string,
};

PrefillAlertAndTitle.defaultProps = {
  title: '',
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
  };
}

export default connect(mapStateToProps)(PrefillAlertAndTitle);
