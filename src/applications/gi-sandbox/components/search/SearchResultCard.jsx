import React, { useState } from 'react';
import { connect } from 'react-redux';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import classNames from 'classnames';
import appendQuery from 'append-query';
import { Link } from 'react-router-dom';
import { renderStars } from '../../utils/render';

import { estimatedBenefits } from '../../selectors/estimator';
import { formatCurrency, createId } from '../../utils/helpers';
import { CautionFlagAdditionalInfo } from '../CautionFlagAdditionalInfo';

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
    cautionFlags,
    facilityCode,
    type,
    menonly,
    womenonly,
    hbcu,
    relaffil,
    vetTecProvider,
    preferredProvider,
    programCount,
    programLengthInHours,
  } = institution;

  const [expanded, setCount] = useState(false);

  const profileLink = appendQuery(`/profile/${facilityCode}`);
  const isSchool = type !== 'OJT' && !vetTecProvider;
  const isEmployer = type === 'OJT';
  const isVettec = vetTecProvider;
  const institutionTraits = [
    menonly === 1 && 'Men-only',
    womenonly === 1 && 'Women-only',
    hbcu && 'HBCU',
    relaffil && 'Religious',
  ].filter(Boolean);

  const resultCardClasses = classNames(
    'result-card vads-u-background-color--gray-lightest vads-u-margin-bottom--2',
    { 'vads-u-margin-left--2p5': !location },
  );

  const schoolClassificationClasses = classNames('school-classification', {
    'school-header': isSchool,
    'employer-header': isEmployer,
    'vettec-header': isVettec,
  });

  const schoolClassification = (
    <>
      <div className={schoolClassificationClasses}>
        <p className="vads-u-color--white">
          <strong>
            {isSchool && 'School'}
            {isEmployer && 'Employer'}
            {isVettec && 'VET TEC'}
            {institutionTraits.length > 0 && ': '}
          </strong>
          {institutionTraits.join(', ')}
        </p>
      </div>
    </>
  );

  const nameCityStateHeader = (
    <>
      <div className="card-title-section">
        <Link to={profileLink}>
          <h3 className="vads-u-margin-top--2">{name}</h3>
        </Link>
      </div>
      <p className="vads-u-padding--0">
        {city}
        {state && `, ${state}`}
      </p>
    </>
  );

  const ratingsInformation =
    ratingCount > 0 ? (
      <div>
        <p className="vads-u-margin-bottom--0">
          <strong>Rated By:</strong> {ratingCount}
        </p>
        <div className="vads-u-margin-bottom--2">
          {renderStars(ratingAverage)} ({Math.round(10 * ratingAverage) / 10} of
          5)
        </div>
      </div>
    ) : (
      <div>
        <p>
          <strong>School rating:</strong> Not yet rated
        </p>
      </div>
    );

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

  const tuitionAndEligibility = (
    <>
      <p>
        <strong>You may be eligible for up to:</strong>
      </p>
      <div className="vads-u-display--flex vads-u-margin-top--0 vads-u-margin-bottom--2">
        <div className="vads-u-flex--1">
          <p className="secondary-info-label">Tuition benefit:</p>
          <p className="vads-u-margin-y--0">{tuition}</p>
        </div>
        <div className="vads-u-flex--1">
          <p className="secondary-info-label">Housing Benefit:</p>
          <p className="vads-u-margin-y--0">
            {housing} / Month
            {isEmployer && '*'}
          </p>
        </div>
      </div>
      {isEmployer && (
        <p className="asterisk-text">
          * Housing rate and the amount of entitlement used decrease every 6
          months as employer pay increases
        </p>
      )}
    </>
  );

  const schoolEmployerInstitutionDetails = (
    <>
      <div className="vads-u-flex--1">
        <p className="secondary-info-label">
          <strong>Accreditation:</strong>
        </p>
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--2p5">
          {(accreditationType &&
            accreditationType.charAt(0).toUpperCase() +
              accreditationType.slice(1)) ||
            'None'}
        </p>
      </div>
      <div className="vads-u-flex--1">
        <p className="secondary-info-label">
          <strong>GI Bill Students:</strong>
        </p>
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--2p5">
          {studentCount || '0'}
        </p>
      </div>
    </>
  );

  const programHours = () => {
    if (programLengthInHours.length > 0) {
      const maxHours = Math.max(...programLengthInHours);
      const minHours = Math.min(...programLengthInHours);
      return `${
        minHours === maxHours ? minHours : `${minHours} - ${maxHours}`
      } hours`;
    }
    return 'TBD';
  };

  const vettecInstitutionDetails = (
    <>
      <div className="vads-u-flex--1">
        <p className="secondary-info-label">
          <strong>Approved programs:</strong>
        </p>
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--2p5">
          {programCount}
        </p>
      </div>
      <div className="vads-u-flex--1">
        <p className="secondary-info-label">
          <strong>Program length:</strong>
        </p>
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--2p5">
          {programHours()}
        </p>
      </div>
    </>
  );

  return (
    <div className={resultCardClasses} id={`${createId(name)}-result-card`}>
      {schoolClassification}
      {location && <span id={`${createId(name)}-result-card-placeholder`} />}
      <div className="vads-u-padding-x--2 vads-u-margin-bottom--1">
        {header || nameCityStateHeader}
        {isSchool && ratingsInformation}
        {preferredProvider && (
          <span className="preferred-provider-text">
            <i className="fa fa-star vads-u-color--gold" />
            <strong> Preferred Provider</strong>
          </span>
        )}
      </div>
      {cautionFlags.length > 0 && (
        <div className="caution-flag-section">
          <CautionFlagAdditionalInfo
            cautionFlags={cautionFlags}
            expanded={expanded}
            setCount={setCount}
          />
        </div>
      )}
      {!expanded && (
        <>
          <div
            className={classNames(
              'vads-u-padding-x--2 vads-u-margin-bottom--4',
              {
                'vads-u-border-top--3px': cautionFlags.length === 0,
                'vads-u-border-color--white': cautionFlags.length === 0,
              },
            )}
          >
            {tuitionAndEligibility}
          </div>
          <div className="vads-u-border-top--3px vads-u-border-color--white vads-u-padding-x--2">
            <div className="vads-u-display--flex vads-u-margin-top--1 ">
              {!isVettec
                ? schoolEmployerInstitutionDetails
                : vettecInstitutionDetails}
            </div>
          </div>
        </>
      )}

      <div
        className={classNames(
          'vads-u-display--flex, vads-u-text-align--center',
          {
            'vads-u-border-top--3px': !expanded,
            'vads-u-border-color--white': !expanded,
          },
        )}
      >
        <div className="card-bottom-cell vads-u-flex--1 vads-u-border-right--2px vads-u-border-color--white vads-u-margin--0">
          <div className="vads-u-padding--0 vads-u-margin-top--neg2 vads-u-margin-bottom--0p5">
            <Checkbox label="Compare" />
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  estimated: estimatedBenefits(state, props),
});

export default connect(mapStateToProps)(SearchResultCard);
