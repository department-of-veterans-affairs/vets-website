import React from 'react';
import { Link } from 'react-router-dom';
import appendQuery from 'append-query';

import {
  formatCurrency,
  isPresent,
  locationInfo,
  createId,
  useQueryParams,
} from '../../utils/helpers';
import {
  renderPreferredProviderFlag,
  renderCautionAlert,
  renderSchoolClosingAlert,
} from '../../utils/render';

function VetTecProgramSearchResult({ result, constants, id }) {
  const {
    facilityCode,
    description,
    institutionName,
    physicalCity,
    physicalState,
    physicalCountry,
    tuitionAmount,
    lengthInHours,
    dodBah,
    schoolClosing,
    schoolClosingOn,
    cautionFlags,
  } = result;

  const queryParams = useQueryParams();
  const version = queryParams.get('version');
  const tuition = isPresent(tuitionAmount)
    ? formatCurrency(tuitionAmount)
    : 'TBD';

  const displayHours = lengthInHours === '0' ? 'TBD' : `${lengthInHours} hours`;

  const profileLink = version
    ? appendQuery(`/profile/${facilityCode}/${description}`, { version })
    : `/profile/${facilityCode}/${description}`;

  return (
    <div id={`search-result-${createId(id)}`} className="search-result">
      <div className="outer">
        <div className="inner">
          <div className="row vads-u-padding-top--1p5">
            <div className="small-12 medium-6 columns">
              <h2>
                <Link
                  to={profileLink}
                  aria-label={`${description} ${locationInfo(
                    physicalCity,
                    physicalState,
                    physicalCountry,
                  )}`}
                >
                  {description}
                </Link>
              </h2>
            </div>
            <div className="small-12 medium-3 columns">
              {renderPreferredProviderFlag(result)}
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
                  {locationInfo(physicalCity, physicalState, physicalCountry)}
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
          <div className="row ">
            <div className="view-details columns vads-u-display--inline-block">
              {isPresent(lengthInHours) && (
                <div className="info-flag">{displayHours}</div>
              )}
              <div className="vads-u-margin-top--1">
                <Link to={profileLink}>View details ›</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VetTecProgramSearchResult;
