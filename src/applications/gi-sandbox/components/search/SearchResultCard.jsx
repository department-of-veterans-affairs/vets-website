import React from 'react';
import { connect } from 'react-redux';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import classNames from 'classnames';
import appendQuery from 'append-query';
import { Link } from 'react-router-dom';
import { renderStars } from '../../utils/render';

import { estimatedBenefits } from '../../selectors/estimator';
import { formatCurrency, createId } from '../../utils/helpers';

export function SearchResultCard({
  institution,
  estimated,
  header,
  location = false,
}) {
  const {
    name,
    city,
    state,
    studentCount,
    ratingAverage,
    ratingCount,
    accreditationType,
    facilityCode,
  } = institution;

  const resultCardClasses = classNames(
    'result-card vads-u-background-color--gray-lightest vads-u-margin-bottom--2',
    { 'vads-u-margin-left--2p5': !location },
  );

  const nameCityStateHeader = (
    <>
      <div className="card-title-section">
        <h3 className="vads-u-margin-top--2">{name}</h3>
      </div>
      <p className="vads-u-padding--0">
        {city}
        {state && `, ${state}`}
      </p>
    </>
  );

  const hideAccreditationType = accreditationType !== 'regional';
  const accreditationTypeClassNames = classNames(
    'accreditation-tag vads-u-background-color--white vads-u-margin--0 vads-u-border--2px vads-u-border-color--black vads-u-display--blocks',
    { 'vads-u-visibility--hidden': hideAccreditationType },
  );

  const accreditationTypeElement =
    location && hideAccreditationType ? null : (
      <div className={accreditationTypeClassNames}>Regionally accredited</div>
    );

  const noSchoolRatingClasses = classNames({
    'vads-u-padding-bottom--3': !location,
  });

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

  const profileLink = appendQuery(`/profile/${facilityCode}`);

  return (
    <div className={resultCardClasses} id={`${createId(name)}-result-card`}>
      {location && <span id={`${createId(name)}-result-card-placeholder`} />}
      <div className="vads-u-padding-x--2">
        {header || nameCityStateHeader}

        {accreditationTypeElement}

        <p>
          <strong>GI Bill Students:</strong> {studentCount}
        </p>
        {ratingCount > 0 ? (
          <div>
            <p className="vads-u-margin-bottom--0">
              <strong>Rated By:</strong> {ratingCount}
            </p>
            <div className="vads-u-margin-bottom--2">
              {renderStars(ratingAverage)} (
              {Math.round(10 * ratingAverage) / 10} of 5)
            </div>
          </div>
        ) : (
          <div className={noSchoolRatingClasses}>
            <p>
              <strong>School rating:</strong> Not yet rated
            </p>
          </div>
        )}
      </div>
      <div className="vads-u-border-top--3px vads-u-border-color--white vads-u-padding-x--2">
        <p>
          <strong>You may be eligible for up to:</strong>
        </p>
        <div className="vads-u-display--flex vads-u-text-align--center vads-u-margin-top--0 vads-u-margin-bottom--2">
          <div className="vads-u-flex--1">
            <p className="secondary-info-label">Tuition benefit:</p>
            <p className="vads-u-margin-y--0">{tuition}</p>
          </div>
          <div className="vads-u-flex--1">
            <p className="secondary-info-label">Housing Benefit:</p>
            <p className="vads-u-margin-y--0">{housing} / Month</p>
          </div>
        </div>
      </div>
      <div className="vads-u-display--flex vads-u-border-top--3px vads-u-border-color--white vads-u-text-align--center">
        <div className="card-bottom-cell vads-u-flex--1 vads-u-border-right--2px vads-u-border-color--white vads-u-margin--0">
          <div className="vads-u-padding--0 vads-u-margin-top--neg2 vads-u-margin-bottom--0p5">
            <Checkbox label="Compare" />
          </div>
        </div>
        <div className="card-bottom-cell vads-u-flex--1 vads-u-border-left--2px vads-u-border-color--white">
          <Link to={profileLink}>View details ›</Link>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  estimated: estimatedBenefits(state, props),
});

export default connect(mapStateToProps)(SearchResultCard);
