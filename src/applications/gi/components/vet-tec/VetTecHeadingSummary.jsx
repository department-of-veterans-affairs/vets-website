import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import VetTecAdditionalResources from './VetTecAdditionalResources';
import { formatNumber } from '../../utils/helpers';

const IconWithInfo = ({ icon, children }) => (
  <p className="icon-with-info">
    <i className={`fa fa-${icon}`} />
    &nbsp;
    {children}
  </p>
);

export const VetTecHeadingSummary = ({
  institution,
  onLearnMore,
  onViewWarnings,
}) => (
  <div className="heading row">
    <div className="usa-width-two-thirds medium-8 small-12 column">
      <h1>{institution.name}</h1>
      <AlertBox
        content={
          <p>
            Are you enrolled in this school?{' '}
            <a
              href="https://www.benefits.va.gov/GIBILL/FGIB/Restoration.asp"
              rel="noopener noreferrer"
              target="_blank"
            >
              Find out if you qualify to have your benefits restored.
            </a>
          </p>
        }
        headline="This school is closing soon"
        isVisible={!!institution.schoolClosing}
        status="warning"
      />
      <div className="caution-flag">
        <AlertBox
          content={
            <a href="#viewWarnings" onClick={onViewWarnings}>
              View cautionary information about this school
            </a>
          }
          headline="This school has cautionary warnings"
          isVisible={!!institution.cautionFlag}
          status="warning"
        />
      </div>
      <div className="column">
        <p>
          <strong>{formatNumber(institution.studentCount)}</strong> GI Bill
          students (
          <button
            type="button"
            className="va-button-link learn-more-button"
            onClick={onLearnMore}
          >
            Learn more
          </button>
          )
        </p>
      </div>
      <div>
        <div className="usa-width-one-half medium-6 small-12 column">
          {institution.city &&
            institution.country && (
              <IconWithInfo icon="map-marker">
                {institution.city}, {institution.state || institution.country}
              </IconWithInfo>
            )}
          {institution.website && (
            <IconWithInfo icon="globe">
              <a
                href={institution.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {institution.website}
              </a>
            </IconWithInfo>
          )}
        </div>

        <div className="usa-width-one-half medium-6 small-12 column">
          {institution.type === 'ojt' && (
            <IconWithInfo icon="briefcase">On-the-job training</IconWithInfo>
          )}
          {institution.type &&
            institution.type !== 'ojt' && (
              <IconWithInfo icon="institution">
                {_.capitalize(institution.type)} school
              </IconWithInfo>
            )}
          {institution.localeType &&
            institution.type &&
            institution.type !== 'ojt' && (
              <IconWithInfo icon="map">
                >{_.capitalize(institution.localeType)} locale
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
