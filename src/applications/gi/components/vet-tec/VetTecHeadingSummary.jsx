import PropTypes from 'prop-types';
import React from 'react';

import VetTecAdditionalResources from './VetTecAdditionalResources';
import environment from 'platform/utilities/environment';
import { locationInfo, phoneInfo, isPresent } from '../../utils/helpers';
import { ariaLabels } from '../../constants';
import _ from 'lodash';
import { renderVetTecLogo } from '../../utils/render';
import classNames from 'classnames';

const IconWithInfo = ({ icon, iconClassName, children, present }) => {
  if (!present) return null;
  return (
    <div className="icon-with-info vads-l-grid-container vads-u-padding-x--0">
      <div className="vads-l-row vads-u-padding-x--0 vads-u-padding-bottom--1p5">
        <div className="vads-l-col--1">
          <i className={`fa fa-${icon} ${iconClassName}`} aria-hidden="true" />
        </div>
        <div className="text-column vads-l-col--11 vads-u-padding-left--1">
          {children}
        </div>
      </div>
    </div>
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

  const prodFlagHeader = environment.isProduction()
    ? 'usa-width-two-thirds medium-8 small-12 column'
    : 'usa-width-two-thirds medium-8 small-12 column vads-u-padding-bottom--6';

  const prodFlagIcons = environment.isProduction()
    ? 'usa-width-two-thirds medium-8 small-12 column vads-u-margin-top--2'
    : 'usa-width-two-thirds medium-8 small-12 column vads-u-margin-top--neg3 vads-u-padding-bottom--2';

  const prodFlagLogoInner = environment.isProduction()
    ? 'vads-u-display--none medium-screen:vads-u-display--block vettec-logo-container vads-u-padding-top--0 vads-u-padding-bottom--0p5'
    : 'vads-u-margin-top--neg6 vads-u-display--none medium-screen:vads-u-display--block vettec-logo-container vads-u-padding-top--0 vads-u-padding-bottom--0p5';

  const prodFlagLogoOuter = environment.isProduction()
    ? 'usa-width-one-third medium-8 small-12 vads-padding-left-0p5 vads-u-margin-top--neg6'
    : 'usa-width-one-third medium-8 small-12 vads-padding-left-0p5 vads-u-margin-top--neg1';

  return (
    <div className="heading">
      <div className="row">
        <div className={prodFlagHeader}>
          <h1 tabIndex={-1}>{institution.name}</h1>
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
        <div className={prodFlagLogoOuter}>
          <div className={prodFlagLogoInner}>
            {renderVetTecLogo(classNames('vettec-logo'))}
          </div>
        </div>
      </div>

      <div className="row">
        <div className={prodFlagIcons}>
          <div className="usa-width-one-half medium-6 small-12 column">
            <IconWithInfo
              icon="map-marker"
              present={isPresent(formattedAddress)}
            >
              {formattedAddress}
            </IconWithInfo>
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
          </div>
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
        </div>
        <VetTecAdditionalResources />
      </div>
    </div>
  );
};

VetTecHeadingSummary.propTypes = {
  institution: PropTypes.object,
  showModal: PropTypes.func,
};

export default VetTecHeadingSummary;
