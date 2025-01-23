import PropTypes from 'prop-types';
import React from 'react';

export const VetTecAdditionalInformation = ({
  institution: { facilityCode },
  showModal,
}) => (
  <div className="additional-information row vads-u-margin-top--1">
    <div className="usa-width-one-half medium-6 columns">
      <div aria-live="off" className="institution-codes usa-width-one-whole">
        <h3>Institution codes</h3>
        <div aria-live="off">
          <strong>
            {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
            <button
              id="facilityCode-button"
              type="button"
              className="va-button-link learn-more-button"
              onClick={() => showModal('facilityCode')}
            >
              VA facility code:
            </button>
            &nbsp;
          </strong>
          {facilityCode || 'N/A'}
        </div>
      </div>
    </div>
  </div>
);

VetTecAdditionalInformation.propTypes = {
  institution: PropTypes.object,
  showModal: PropTypes.func,
};

export default VetTecAdditionalInformation;
