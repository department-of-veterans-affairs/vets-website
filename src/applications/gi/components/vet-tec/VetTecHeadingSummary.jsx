import PropTypes from 'prop-types';
import React from 'react';

import VetTecAdditionalResources from './VetTecAdditionalResources';

const IconWithInfo = ({ icon, iconClassName, children, present }) => {
  if (!present) return null;
  return (
    <p className="icon-with-info">
      <i className={`fa fa-${icon} ${iconClassName}`} />
      {children}
    </p>
  );
};

export const VetTecHeadingSummary = ({ institution, showModal }) => (
  <div className="heading row">
    <div className="usa-width-two-thirds medium-8 small-12 column">
      <h1>{institution.name}</h1>
      <div>
        <div className="usa-width-one-half medium-6 small-12 column">
          <IconWithInfo
            icon="star"
            iconClassName="vads-u-color--gold"
            present={
              institution.preferredProvider &&
              institution.preferredProvider === true
            }
          >
            <span>Preferred Provider </span>
            <button
              aria-label="preferred provider learn more"
              type="button"
              className="va-button-link learn-more-button"
              onClick={() => showModal('preferredProviders')}
            >
              (Learn more)
            </button>
          </IconWithInfo>
          {institution.city &&
            institution.country && (
              <IconWithInfo
                icon="map-marker"
                present={institution.city && institution.country}
              >
                &nbsp;
                {institution.city}, {institution.state || institution.country}
              </IconWithInfo>
            )}
        </div>
      </div>
    </div>
    <VetTecAdditionalResources />
  </div>
);

VetTecHeadingSummary.propTypes = {
  institution: PropTypes.object,
  showModal: PropTypes.func,
};

export default VetTecHeadingSummary;
