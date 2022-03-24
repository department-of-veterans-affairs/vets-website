import React from 'react';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/Telephone';

const DisabilityRatingShortFormConfirmation = ({ goForward, data }) => {
  const disabilityRating = data['view:totalDisabilityRating'];
  return (
    <div>
      <div className="hca-id-form-wrapper vads-u-margin-bottom--2 vads-u-margin-x--neg1p5">
        <div className="vads-u-margin-bottom--9">
          <va-alert
            close-btn-aria-label="Close notification"
            status="info"
            visible
          >
            <h3 slot="headline">You can fill out a shorter application</h3>
            <div>
              Our records show that you have a{' '}
              <strong>
                VA service-connected disability rating of {disabilityRating}
                %.
              </strong>{' '}
              Because your rating is 50% or higher, we can ask you fewer
              questions.
            </div>
            <div>
              <a
                className="vads-c-action-link--green"
                href="#start"
                onClick={goForward}
              >
                Continue to application
              </a>
            </div>
          </va-alert>
        </div>
        <div>
          <div className="vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--lg vads-u-margin-bottom--4">
            What if I don’t think my rating information is correct here?
          </div>
          <div>
            Call us at <va-telephone contact="877-222-8387" />. We’re here
            Monday through Friday, 8:00 a.m. to 9:00 p.m. ET. If you have
            hearing loss, call TTY: <va-telephone contact={CONTACTS[711]} />.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisabilityRatingShortFormConfirmation;

DisabilityRatingShortFormConfirmation.propTypes = {
  data: PropTypes.object,
  goForward: PropTypes.func,
};
