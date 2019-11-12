import PropTypes from 'prop-types';
import React from 'react';

import VetTecAdditionalResources from './VetTecAdditionalResources';

import { locationInfo, phoneInfo, isPresent } from '../../utils/helpers';
import environment from 'platform/utilities/environment';
import { ariaLabels } from '../../constants';
import _ from 'lodash';

const IconWithInfo = ({ icon, iconClassName, children, present }) => {
  if (!present) return null;
  return (
    <p className="icon-with-info">
      <i className={`fa fa-${icon} ${iconClassName}`} />
      &nbsp;
      {children}
    </p>
  );
};

export const VetTecHeadingSummary = ({ institution, showModal }) => {
  const formattedAddress = locationInfo(
    institution.city,
    institution.state,
    institution.country,
  );

  const firstProgram = _.get(institution, 'programs[0]', {
    providerWebsite: '',
    phoneAreaCode: '',
    phoneNumber: '',
    schoolLocale: '',
  });

  const providerPhone = phoneInfo(
    firstProgram.phoneAreaCode,
    firstProgram.phoneNumber,
  );

  return (
    <div className="heading row">
      <div className="usa-width-two-thirds medium-8 small-12 column">
        <h1 tabIndex={-1}>{institution.name}</h1>
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
                aria-label={ariaLabels.learnMore.preferredProvider}
                type="button"
                className="va-button-link learn-more-button"
                onClick={() => showModal('preferredProviders')}
              >
                (Learn more)
              </button>
            </IconWithInfo>
          </div>
        </div>
      </div>
      <div className="usa-width-two-thirds medium-8 small-12 column vads-u-margin-top--2">
        <div className="usa-width-one-half medium-6 small-12 column">
          <IconWithInfo icon="map-marker" present={isPresent(formattedAddress)}>
            {formattedAddress}
          </IconWithInfo>
          {/* Production flag for 19736 */}
          {!environment.isProduction() && (
            <IconWithInfo
              icon="globe"
              present={isPresent(firstProgram.providerWebsite)}
            >
              <a
                href={firstProgram.providerWebsite}
                target="_blank"
                rel="noopener noreferrer"
              >
                {firstProgram.providerWebsite}
              </a>
            </IconWithInfo>
          )}
        </div>
        {/* Production flag for 19736 */}
        {!environment.isProduction() && (
          <div className="usa-width-one-half medium-6 small-12 column">
            <IconWithInfo icon="phone" present={isPresent(providerPhone)}>
              <a href={`tel:+1${`${providerPhone}`}`}>{providerPhone}</a>
            </IconWithInfo>
            <IconWithInfo
              icon="map"
              present={isPresent(firstProgram.schoolLocale)}
            >
              {`${firstProgram.schoolLocale}  locale`}
            </IconWithInfo>
          </div>
        )}
      </div>
      <VetTecAdditionalResources />
    </div>
  );
};

VetTecHeadingSummary.propTypes = {
  institution: PropTypes.object,
  showModal: PropTypes.func,
};

export default VetTecHeadingSummary;
