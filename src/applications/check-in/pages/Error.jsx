import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import { focusElement } from 'platform/utilities/ui';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

const Error = props => {
  const { appointment } = props;
  const { clinicPhoneNumber } = appointment || {};
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5 ">
      <va-alert status="error">
        <h1 tabIndex="-1" slot="headline">
          We couldn’t check you in
        </h1>
        <p data-testid="error-message">
          We’re sorry. Something went wrong on our end. Check in with a staff
          member
          {clinicPhoneNumber ? (
            <>
              {' '}
              or call us at <Telephone contact={clinicPhoneNumber} />
            </>
          ) : (
            ''
          )}
          .
        </p>
      </va-alert>
      <Footer />
      <BackToHome />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    appointment: state.checkInData?.appointment,
  };
};
const mapDispatchToProps = () => {
  return {};
};

Error.propTypes = {
  appointment: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Error);
