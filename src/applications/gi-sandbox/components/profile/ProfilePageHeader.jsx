import PropTypes from 'prop-types';
import React, { useState } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import {
  convertRatingToStars,
  formatNumber,
  locationInfo,
  schoolSize,
} from '../../utils/helpers';
import { ariaLabels, MINIMUM_RATING_COUNT } from '../../constants';
import recordEvent from 'platform/monitoring/record-event';
import RatingsStars from '../RatingsStars';
import Checkbox from '../Checkbox';
import { religiousAffiliations } from '../../utils/data/religiousAffiliations';
import { CautionFlagAdditionalInfo } from '../CautionFlagAdditionalInfo';

const IconWithInfo = ({ icon, children, present }) => {
  if (!present) return null;
  return (
    <p className="icon-with-info">
      <i className={`fa fa-${icon}`} />
      &nbsp;
      {children}
    </p>
  );
};

const ProfilePageHeader = ({
  institution,
  gibctSchoolRatings,
  onGiBillLearnMore,
  onAccreditationLearnMore,
}) => {
  const [expanded, toggleExpansion] = useState(false);
  const it = institution;
  it.type = it.type && it.type.toLowerCase();
  const formattedAddress = locationInfo(
    it.physicalCity,
    it.physicalState,
    it.physicalCountry,
  );

  const shouldShowSchoolLocations = facilityMap =>
    facilityMap &&
    (facilityMap.main.extensions.length > 0 ||
      facilityMap.main.branches.length > 0);

  const institutionTraits = [
    it.menonly === 1 && 'Men-only',
    it.womenonly === 1 && 'Women-only',
    it.hbcu && 'Historically Black College or University',
    it.relaffil && religiousAffiliations[it.relaffil],
  ].filter(Boolean);

  const main = it.facilityMap.main.institution;

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

  const stars = convertRatingToStars(it.ratingAverage);
  const displayStars =
    gibctSchoolRatings && stars && it.ratingCount >= MINIMUM_RATING_COUNT;

  const titleClasses = classNames({
    'vads-u-margin-bottom--0': displayStars,
  });

  const starClasses = classNames(
    'vads-u-margin-bottom--1',
    it.cautionFlags.length > 0
      ? 'vads-u-margin-top--2'
      : 'vads-u-margin-top--1',
  );

  const renderIconSection = () => (
    <div
      className={classNames(
        'usa-grid vads-u-border-bottom--4px vads-u-border-color--white vads-u-padding-y--1p5 vads-u-padding-x--2',
        {
          'vads-u-border-top--4px': it.cautionFlags.length === 0,
        },
      )}
    >
      <div className="usa-width-one-half">
        <IconWithInfo
          icon="calendar"
          present={it.type !== 'ojt' && it.highestDegree}
        >
          {'  '}
          {_.isFinite(it.highestDegree)
            ? `${it.highestDegree} year`
            : it.highestDegree}{' '}
          program
        </IconWithInfo>
        <IconWithInfo icon="briefcase" present={it.type === 'ojt'}>
          {'   '}
          On-the-job training
        </IconWithInfo>
        <IconWithInfo icon="university" present={it.type && it.type !== 'ojt'}>
          {'   '}
          {_.capitalize(it.type)} school
        </IconWithInfo>
        <IconWithInfo icon="award" present={it.accreditationType}>
          {'   '}
          {_.capitalize(it.accreditationType)} Accreditation (
          <button
            type="button"
            className="va-button-link learn-more-button"
            onClick={onAccreditationLearnMore}
            aria-label={ariaLabels.learnMore.numberOfStudents}
          >
            Learn more
          </button>
          )
        </IconWithInfo>
      </div>
      <div className="usa-width-one-half">
        <IconWithInfo icon="users" present={it.type && it.type !== 'ojt'}>
          {'   '}
          {schoolSize(it.undergradEnrollment)} size
        </IconWithInfo>
        <IconWithInfo
          icon="map"
          present={it.localeType && it.type && it.type !== 'ojt'}
        >
          {'   '}
          {_.capitalize(it.localeType)} locale
        </IconWithInfo>
        <IconWithInfo icon="globe" present={it.website}>
          <a href={it.website} target="_blank" rel="noopener noreferrer">
            {'  '}
            {it.website}
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
      {shouldShowSchoolLocations(it.facilityMap) && (
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
      {/* <a className="arrow-down-link">
        <IconWithInfo icon="arrow-down" present>
          {'   '}
          Academics
        </IconWithInfo>
      </a>
      <a className="arrow-down-link">
        <IconWithInfo icon="arrow-down" present>
          {'   '}
          Student Body & Campus Life
        </IconWithInfo>
      </a> */}
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
            {it.name}
          </h1>
          <p>{formattedAddress}</p>
          {displayStars && (
            <div className={starClasses}>
              <span className="vads-u-font-size--sm">
                <RatingsStars rating={it.ratingAverage} />
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
                See {it.ratingCount} ratings by Veterans
              </a>
              )
            </div>
          )}
          {it.studentCount > 0 && (
            <p>
              <strong>{formatNumber(it.studentCount)}</strong> GI Bill students
              (
              <button
                type="button"
                className="va-button-link learn-more-button"
                onClick={onGiBillLearnMore}
                aria-label={ariaLabels.learnMore.numberOfStudents}
              >
                Learn more
              </button>
              )
            </p>
          )}
        </div>
        {it.cautionFlags.length > 0 && (
          <div className="caution-flag-section">
            <CautionFlagAdditionalInfo
              cautionFlags={it.cautionFlags}
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
              // checked={compareChecked}
              // onChange={handleCompareUpdate}
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
  onGiBillLearnMore: PropTypes.func,
  onViewWarnings: PropTypes.func,
};

export default ProfilePageHeader;
