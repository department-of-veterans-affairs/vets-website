import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import {
  addCompareInstitution,
  removeCompareInstitution,
  showModal,
} from '../actions';

import {
  convertRatingToStars,
  formatNumber,
  locationInfo,
  schoolSize,
} from '../utils/helpers';
import { ariaLabels, MINIMUM_RATING_COUNT } from '../constants';
import recordEvent from 'platform/monitoring/record-event';
import RatingsStars from '../components/RatingsStars';
import Checkbox from '../components/Checkbox';
import { religiousAffiliations } from '../utils/data/religiousAffiliations';
import { CautionFlagAdditionalInfo } from '../components/CautionFlagAdditionalInfo';
import { IconWithInfo } from '../utils/render';

const ProfilePageHeader = ({
  compare,
  dispatchAddCompareInstitution,
  dispatchRemoveCompareInstitution,
  institution,
  dispatchShowModal,
}) => {
  const [expanded, toggleExpansion] = useState(false);
  const {
    type,
    name,
    physicalCity,
    physicalState,
    physicalCountry,
    facilityCode,
    menonly,
    womenonly,
    hbcu,
    relaffil,
    facilityMap,
    ratingCount,
    ratingAverage,
    cautionFlags,
    highestDegree,
    accreditationType,
    undergradEnrollment,
    localeType,
    website,
    studentCount,
  } = institution;
  const lowerType = type && type.toLowerCase();
  const formattedAddress = locationInfo(
    physicalCity,
    physicalState,
    physicalCountry,
  );

  const compareChecked = !!compare.search.institutions[facilityCode];
  const handleCompareUpdate = e => {
    if (e.target.checked && !compareChecked) {
      dispatchAddCompareInstitution(institution);
    } else {
      dispatchRemoveCompareInstitution(facilityCode);
    }
  };

  const shouldShowSchoolLocations = () =>
    facilityMap &&
    (facilityMap.main.extensions.length > 0 ||
      facilityMap.main.branches.length > 0);

  const institutionTraits = [
    menonly === 1 && 'Men-only',
    womenonly === 1 && 'Women-only',
    hbcu && 'Historically Black College or University',
    relaffil && religiousAffiliations[relaffil],
  ].filter(Boolean);

  const main = facilityMap.main.institution;

  const schoolClassificationClasses = classNames('school-classification', {
    'school-header': main.schoolProvider,
    'employer-header': main.employerProvider,
    'vettec-header': main.vetTecProvider,
  });

  const schoolClassification = (
    <>
      <div className={schoolClassificationClasses}>
        <p className="vads-u-color--white vads-u-padding-x--2 vads-u-padding-y--1">
          <strong>
            {main.schoolProvider && 'School'}
            {main.employerProvider && 'Employer'}
            {main.vetTecProvider && 'VET TEC'}
            {institutionTraits.length > 0 && ': '}
          </strong>
          {institutionTraits.join(', ')}
        </p>
      </div>
    </>
  );

  const stars = convertRatingToStars(ratingAverage);
  const displayStars = stars && ratingCount >= MINIMUM_RATING_COUNT;

  const titleClasses = classNames({
    'vads-u-margin-bottom--0': displayStars,
  });

  const starClasses = classNames(
    'vads-u-margin-bottom--1',
    cautionFlags.length > 0 ? 'vads-u-margin-top--2' : 'vads-u-margin-top--1',
  );

  const renderIconSection = () => (
    <div
      className={classNames(
        'usa-grid vads-u-border-bottom--4px vads-u-border-color--white vads-u-padding-y--1p5 vads-u-padding-x--2',
        {
          'vads-u-border-top--4px': cautionFlags.length === 0,
        },
      )}
    >
      <div className="usa-width-one-half">
        <IconWithInfo
          icon="calendar"
          present={lowerType !== 'ojt' && highestDegree}
        >
          {'  '}
          {_.isFinite(highestDegree)
            ? `${highestDegree} year`
            : highestDegree}{' '}
          program
        </IconWithInfo>
        <IconWithInfo icon="briefcase" present={lowerType === 'ojt'}>
          {'   '}
          On-the-job training
        </IconWithInfo>
        <IconWithInfo
          icon="university"
          present={lowerType && lowerType !== 'ojt'}
        >
          {'   '}
          {_.capitalize(lowerType)} school
        </IconWithInfo>
        <IconWithInfo icon="award" present={accreditationType}>
          {'   '}
          {_.capitalize(accreditationType)} Accreditation (
          <button
            type="button"
            className="va-button-link learn-more-button"
            onClick={() => dispatchShowModal('typeAccredited')}
            aria-label={ariaLabels.learnMore.numberOfStudents}
          >
            Learn more
          </button>
          )
        </IconWithInfo>
      </div>
      <div className="usa-width-one-half">
        <IconWithInfo icon="users" present={lowerType && lowerType !== 'ojt'}>
          {'   '}
          {schoolSize(undergradEnrollment)} size
        </IconWithInfo>
        <IconWithInfo
          icon="map"
          present={localeType && lowerType && lowerType !== 'ojt'}
        >
          {'   '}
          {_.capitalize(localeType)} locale
        </IconWithInfo>
        <IconWithInfo icon="globe" present={website}>
          <a href={website} target="_blank" rel="noopener noreferrer">
            {'  '}
            {website}
          </a>
        </IconWithInfo>
      </div>
    </div>
  );

  const renderJumpLinks = () => (
    <div className="usa-width-one-fourth">
      <h2 className="vads-u-padding-top--2">On this page</h2>
      <a
        className="arrow-down-link"
        href="#estimate-your-benefits-accordion-content"
      >
        <IconWithInfo icon="arrow-down" present>
          {'   '}
          Calculate your Benefits
        </IconWithInfo>
      </a>
      {displayStars && (
        <a className="arrow-down-link" href="#school-ratings-accordion-button">
          <IconWithInfo icon="arrow-down" present>
            {'   '}
            Ratings
          </IconWithInfo>
        </a>
      )}
      {shouldShowSchoolLocations() && (
        <a
          className="arrow-down-link"
          href="#school-locations-accordion-button"
        >
          <IconWithInfo icon="arrow-down" present>
            {'   '}
            School locations
          </IconWithInfo>
        </a>
      )}
      <a className="arrow-down-link" href="#contact-details-accordion-button">
        <IconWithInfo icon="arrow-down" present>
          {'   '}
          Contact Information
        </IconWithInfo>
      </a>
    </div>
  );
  const renderProfilePageCard = () => (
    <div className="usa-width-three-fourths">
      <div className="vads-u-background-color--gray-lightest profile-card">
        {schoolClassification}
        <div className="vads-u-padding-left--2">
          <h1 tabIndex={-1} className={titleClasses}>
            {name}
          </h1>
          <p>{formattedAddress}</p>
          {displayStars && (
            <div className={starClasses}>
              <span className="vads-u-font-size--sm">
                <RatingsStars rating={ratingAverage} />
              </span>{' '}
              <span className="vads-u-padding-left--1 vads-u-padding-right--1">
                |
              </span>{' '}
              <span className="vads-u-font-weight--bold vads-u-padding-right--1">
                {stars.display} of 5
              </span>{' '}
              (
              <a
                href="#profile-school-ratings"
                onClick={() => recordEvent({ event: 'nav-jumplink-click' })}
              >
                See {ratingCount} ratings by Veterans
              </a>
              )
            </div>
          )}
          {studentCount > 0 && (
            <p>
              <strong>{formatNumber(studentCount)}</strong> GI Bill students (
              <button
                type="button"
                className="va-button-link learn-more-button"
                onClick={() => dispatchShowModal('gibillstudents')}
                aria-label={ariaLabels.learnMore.numberOfStudents}
              >
                Learn more
              </button>
              )
            </p>
          )}
        </div>
        {cautionFlags.length > 0 && (
          <div className="caution-flag-section">
            <CautionFlagAdditionalInfo
              cautionFlags={cautionFlags}
              expanded={expanded}
              toggleExpansion={toggleExpansion}
            />
          </div>
        )}

        {!expanded && renderIconSection()}

        <div className="card-bottom-cell vads-u-flex--1 vads-u-margin--0">
          <div className="vads-u-padding--0 vads-u-margin-top--neg2 vads-u-margin-bottom--0p5">
            <Checkbox
              label="Compare"
              checked={compareChecked}
              onChange={handleCompareUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="usa-grid vads-u-padding--0 vads-u-margin-bottom--4">
      {renderProfilePageCard()}
      {renderJumpLinks()}
    </div>
  );
};

ProfilePageHeader.propTypes = {
  institution: PropTypes.object,
  onViewWarnings: PropTypes.func,
};

const mapStateToProps = state => ({
  compare: state.compare,
});

const mapDispatchToProps = {
  dispatchAddCompareInstitution: addCompareInstitution,
  dispatchRemoveCompareInstitution: removeCompareInstitution,
  dispatchShowModal: showModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfilePageHeader);
