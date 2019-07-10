import PropTypes from 'prop-types';
import React from 'react';

import VetTecAdditionalResources from './VetTecAdditionalResources';

const IconWithInfo = ({ icon, children }) => (
  <p className="icon-with-info">
    <i className={`fa fa-${icon}`} />
    &nbsp;
    {children}
  </p>
);

export const VetTecHeadingSummary = ({ institution }) => (
  <div className="heading row">
    <div className="usa-width-two-thirds medium-8 small-12 column">
      <h1>{institution.name}</h1>
      <div>
        <div className="usa-width-one-half medium-6 small-12 column">
          {institution.city &&
            institution.country && (
              <IconWithInfo icon="map-marker">
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
  onLearnMore: PropTypes.func,
  onViewWarnings: PropTypes.func,
};

export default VetTecHeadingSummary;
