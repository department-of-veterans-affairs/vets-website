import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const AuthenticatedShortFormAlert = ({ formData }) => {
  const disabilityRating = formData['view:totalDisabilityRating'];
  return (
    <div className="vads-u-margin-y--5 vads-u-margin-x--neg1p5">
      <va-alert status="info">
        <h3 slot="headline">You can fill out a shorter application</h3>
        <p>
          Our records show that you have a{' '}
          <strong>
            VA service-connected disability rating of {disabilityRating}
            %.
          </strong>{' '}
          This means that you meet one of our eligibility criteria and we don’t
          need to ask you questions about other criteria, like income and
          military service.
        </p>
        <va-additional-info trigger="What if I don’t think my rating information is correct here?">
          <p>
            Call us at <va-telephone contact={CONTACTS['222_VETS']} />. We’re
            here Monday through Friday, 8:00 a.m. to 9:00 p.m.{' '}
            <abbr title="eastern time">ET</abbr>. If you have hearing loss, call
            TTY: <va-telephone contact={CONTACTS['711']} />.
          </p>
        </va-additional-info>
      </va-alert>
    </div>
  );
};

AuthenticatedShortFormAlert.propTypes = {
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form.data,
});

export default connect(mapStateToProps)(AuthenticatedShortFormAlert);
