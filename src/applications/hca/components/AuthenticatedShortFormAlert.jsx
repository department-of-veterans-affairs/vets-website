import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/Telephone';

const AuthenticatedShortFormAlert = ({ formData }) => {
  const disabilityRating = formData['view:totalDisabilityRating'];
  return (
    <div className="vads-u-margin-y--5 vads-u-margin-x--neg1p5">
      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h3 slot="headline">You can fill out a shorter application</h3>
        <div>
          Our records show that you have a{' '}
          <strong>
            VA service-connected disability rating of {disabilityRating}
            %.
          </strong>{' '}
          Because your rating is 50% or higher, we can ask you fewer questions.
        </div>
        <div>
          <va-additional-info trigger="What if I don’t think my rating information is correct here?">
            <p>
              Call us at <va-telephone contact="877-222-8387" />. We’re here
              Monday through Friday, 8:00 a.m. to 9:00 p.m. ET. If you have
              hearing loss, call TTY: <va-telephone contact={CONTACTS[711]} />.
            </p>
          </va-additional-info>
        </div>
      </va-alert>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    formData: state.form.data,
  };
};

export default connect(mapStateToProps)(AuthenticatedShortFormAlert);

AuthenticatedShortFormAlert.propTypes = {
  formData: PropTypes.object,
};
