import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import recordEvent from 'platform/monitoring/record-event';

const AuthenticatedShortFormAlert = ({ formData }) => {
  const disabilityRating = formData['view:totalDisabilityRating'];

  // use logging to compare number of short forms started vs completed
  useEffect(() => {
    return () => {
      recordEvent({
        event: 'hca-short-form-flow',
      });
    };
  }, []);

  return (
    <va-alert class="vads-u-margin-y--5" status="info">
      <h3 slot="headline">You can fill out a shorter application</h3>
      <p>
        Our records show that you have a{' '}
        <strong>
          VA service-connected disability rating of {disabilityRating}
          %.
        </strong>{' '}
        This means that you meet one of our eligibility criteria. And we don’t
        need to ask you questions about other criteria like income and military
        service.
      </p>
      <va-additional-info trigger="What if I don’t think my rating information is correct here?">
        Call us at <va-telephone contact={CONTACTS['222_VETS']} />. We’re here
        Monday through Friday, 8:00 a.m. to 9:00 p.m.{' '}
        <abbr title="eastern time">ET</abbr>. If you have hearing loss, call{' '}
        <va-telephone contact={CONTACTS['711']} tty />.
      </va-additional-info>
    </va-alert>
  );
};

AuthenticatedShortFormAlert.propTypes = {
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form.data,
});

export default connect(mapStateToProps)(AuthenticatedShortFormAlert);
