import React from 'react';
import { Link } from 'react-router';

import environment from 'platform/utilities/environment';
import {
  formatCurrency,
  isPresent,
  locationInfo,
  createId,
} from '../../utils/helpers';
import {
  renderPreferredProviderFlag,
  renderCautionAlert,
  renderSchoolClosingAlert,
} from '../../utils/render';

function VetTecProgramSearchResult(props) {
  const { version, result, constants, id } = props;
  const {
    facilityCode,
    description,
    institutionName,
    city,
    state,
    country,
    tuitionAmount,
    lengthInHours,
    dodBah,
    schoolClosing,
    schoolClosingOn,
    cautionFlags,
  } = result;

  const tuition = isPresent(tuitionAmount)
    ? formatCurrency(tuitionAmount)
    : 'TBD';

  const displayHours = lengthInHours === '0' ? 'TBD' : `${lengthInHours} hours`;

  const linkTo = environment.isProduction()
    ? {
        pathname: `/profile/${facilityCode}/${description}`,
        query: version ? { version } : {},
      }
    : {
        pathname: `/profile/${facilityCode}/${description}`,
        search: version ? `?version=${version}` : '',
      };

  return (
    <div id={`search-result-${createId(id)}`} className="search-result">
      <div className="outer">
        <div className="inner">
          <div className="row vads-u-padding-top--1p5">
            <div className="small-12 medium-7 columns">
              <h2>
                <Link
                  to={linkTo}
                  aria-label={`${description} ${locationInfo(
                    city,
                    state,
                    country,
                  )}`}
                >
                  {description}
                </Link>
              </h2>
            </div>
            <div className="small-12 medium-3 columns">
              {renderPreferredProviderFlag(props.result)}
            </div>
          </div>
          {(schoolClosing || cautionFlags.length > 0) && (
            <div className="row alert-row">
              <div className="small-12 columns">
                {renderSchoolClosingAlert({ schoolClosing, schoolClosingOn })}
                {renderCautionAlert(cautionFlags)}
              </div>
            </div>
          )}
          <div className="row vads-u-padding-top--1p5">
            <div className="small-12 medium-7 columns">
              <div style={{ position: 'relative', bottom: 0 }}>
                <p className="institution-name vads-u-font-weight--bold">
                  {institutionName}
                </p>
                <p className="institution-location">
                  {locationInfo(city, state, country)}
                </p>
              </div>
            </div>
            <div className="small-12 medium-5 columns estimated-benefits">
              <h3>You may be eligible for up to:</h3>
              <div className="row">
                <div className="columns">
                  <h4>
                    <i
                      aria-hidden="true"
                      className="fa fa-graduation-cap fa-search-result"
                    />
                    Tuition:
                    <div className="programTuition">{tuition}</div>
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="columns">
                  <h4>
                    <i
                      aria-hidden="true"
                      className="fa fa-home fa-search-result"
                    />
                    Housing <span>(monthly):</span>
                    <div className="programHousingAllowance">
                      {`${formatCurrency(
                        constants.AVGDODBAH / 2,
                      )} - ${formatCurrency(dodBah)}`}
                    </div>
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="row vads-u-padding-top--1p5">
            <div className="view-details columns vads-u-display--inline-block">
              {isPresent(lengthInHours) && (
                <div className="info-flag">{displayHours}</div>
              )}
              <Link to={linkTo}>View details ›</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VetTecProgramSearchResult;
