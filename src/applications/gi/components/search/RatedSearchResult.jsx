import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import { Link } from 'react-router-dom';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { estimatedBenefits } from '../../selectors/estimator';
import {
  convertRatingToStars,
  formatCurrency,
  locationInfo,
  useQueryParams,
} from '../../utils/helpers';
import {
  renderCautionAlert,
  renderSchoolClosingAlert,
  renderStars,
} from '../../utils/render';

import ScorecardTags from '../../components/ScorecardTags';

export function RatedSearchResult({
  gibctFilterEnhancement,
  schoolClosing,
  schoolClosingOn,
  estimated,
  facilityCode,
  name,
  city,
  state,
  country,
  studentCount,
  cautionFlags,
  menOnly,
  womenOnly,
  hbcu,
  relAffil,
  alias,
  ratingAverage,
  ratingCount,
}) {
  const queryParams = useQueryParams();
  const estimate = ({ qualifier, value }) => {
    if (qualifier === '% of instate tuition') {
      return <span>{value}% in-state</span>;
    } else if (qualifier === null) {
      return value;
    }
    return <span>{formatCurrency(value)}</span>;
  };

  const tuition = estimate(estimated.tuition);
  const housing = estimate(estimated.housing);
  const books = estimate(estimated.books);
  const version = queryParams.get('version');
  const profileLink = version
    ? appendQuery(`/profile/${facilityCode}`, { version })
    : `/profile/${facilityCode}`;
  const stars = convertRatingToStars(ratingAverage);
  const displayStars = stars && ratingCount > 0;

  return (
    <div
      id={`search-result-${facilityCode}`}
      className="search-result"
      search-alias={alias}
    >
      <div className="outer">
        <div className="inner">
          <div className="row">
            <div className="small-12 medium-12 columns vads-u-padding-bottom--2">
              <h2>
                {' '}
                <Link
                  to={profileLink}
                  aria-label={`${name} ${locationInfo(city, state, country)}`}
                >
                  {name}
                </Link>
              </h2>
              <p id={`location-${facilityCode}`}>
                {locationInfo(city, state, country)}
              </p>
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
          <div className="row">
            <div
              className={
                'small-12 medium-7 columns estimated-benefits vads-u-padding-bottom--2'
              }
            >
              <h3>You may be eligible for up to:</h3>
              <div className="row">
                <div className="vads-u-font-weight--bold columns small-12 medium-3">
                  Tuition:
                </div>
                <div className="columns small-12 medium-9">{tuition}</div>
              </div>
              <div className="row">
                <div className="vads-u-font-weight--bold columns small-12 medium-3">
                  Housing:
                </div>
                <div
                  className="columns small-12 medium-9"
                  id={`housing-value-${facilityCode}`}
                >
                  {housing}
                </div>
              </div>
              <div className="row">
                <div className="vads-u-font-weight--bold columns small-12 medium-3">
                  Books:
                </div>
                <div className="columns small-12 medium-9">{books}</div>
              </div>
            </div>

            <div className="small-12  medium-5 columns vads-u-padding-bottom--2">
              <div>
                <p>
                  <span className="vads-u-font-weight--bold">
                    GI Bill students:
                  </span>{' '}
                  {(+studentCount).toLocaleString()}
                </p>
              </div>
            </div>

            {displayStars && (
              <div className="small-12  medium-5 columns vads-u-padding-bottom--2">
                <span className="vads-u-font-weight--bold">Rated by:</span>{' '}
                {(+ratingCount).toLocaleString()} Veterans
                <div>
                  {renderStars(ratingAverage)} ({stars.display} of 5)
                </div>
              </div>
            )}
            {!displayStars && (
              <div className="small-12  medium-5 columns vads-u-padding-bottom--2">
                <span className="vads-u-font-weight--bold">School rating:</span>{' '}
                Not yet rated
              </div>
            )}

            {gibctFilterEnhancement && (
              <div className="small-12  medium-5 columns">
                <ScorecardTags
                  styling="search-result-tag"
                  menOnly={menOnly}
                  womenOnly={womenOnly}
                  hbcu={hbcu}
                  relAffil={relAffil}
                />
              </div>
            )}
          </div>
          <div className="row">
            <div className="columns">
              <Link to={profileLink}>View details ›</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  estimated: estimatedBenefits(state, props),
  gibctFilterEnhancement: toggleValues(state)[
    FEATURE_FLAG_NAMES.gibctFilterEnhancement
  ],
});

export default connect(mapStateToProps)(RatedSearchResult);
