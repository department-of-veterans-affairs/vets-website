import React, { useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import appendQuery from 'append-query';
import { Link } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import {
  addCompareInstitution,
  removeCompareInstitution,
  showModal,
} from '../../actions';
import { MINIMUM_RATING_COUNT } from '../../constants';
import CompareCheckbox from '../../components/CompareCheckbox';
import { estimatedBenefits } from '../../selectors/estimator';
import {
  formatCurrency,
  createId,
  convertRatingToStars,
  showSchoolContentBasedOnType,
} from '../../utils/helpers';
import { CautionFlagAdditionalInfo } from '../../components/CautionFlagAdditionalInfo';
import RatingsStars from '../../components/profile/schoolRatings/RatingsStars';
import SchoolClassification from '../../components/SchoolClassification';

// environment variable to keep ratings out of production until ready
const isProduction = !environment.isProduction();

export function ResultCard({
  compare,
  estimated,
  dispatchAddCompareInstitution,
  dispatchRemoveCompareInstitution,
  dispatchShowModal,
  institution,
  location = false,
  header = null,
  active = false,
  version,
}) {
  const {
    name,
    city,
    state,
    studentCount,
    accreditationType,
    cautionFlags,
    facilityCode,
    vetTecProvider,
    schoolProvider,
    employerProvider,
    tuitionOutOfState,
    preferredProvider,
    programCount,
    programLengthInHours,
    type,
  } = institution;

  let ratingCount = 0;
  let ratingAverage = false;
  let institutionRatingIsNotNull = false;
  let institutionCountIsNotNull = false;
  let institutionOverallAvgIsNotNull = false;
  /** ***CHECK IF INSTITUTION.INSTITUTIONRATING IS NULL**** */
  if (institution.institutionRating != null) {
    institutionRatingIsNotNull = true;
  }
  if (
    institutionRatingIsNotNull &&
    institution.institutionRating.institutionRatingCount != null
  ) {
    institutionCountIsNotNull = true;
  }
  if (
    institutionRatingIsNotNull &&
    institutionCountIsNotNull &&
    institution.institutionRating.overallAvg != null
  ) {
    institutionOverallAvgIsNotNull = true;
  }
  if (
    institutionRatingIsNotNull &&
    institutionCountIsNotNull &&
    institutionOverallAvgIsNotNull
  ) {
    const {
      institutionRatingCount,
      overallAvg,
    } = institution.institutionRating;
    ratingCount = institutionRatingCount;
    ratingAverage = overallAvg;
  }
  /// /////////////////////////////////////////////////////////

  const compareChecked = !!compare.search.institutions[facilityCode];
  const compareLength = compare.search.loaded.length;

  const handleCompareUpdate = e => {
    if (e.target.checked && !compareChecked) {
      if (compareLength === 3) {
        recordEvent({
          event: 'gibct-form-change',
          'gibct-form-field': 'compareCheckbox',
          'gibct-form-value': `Limit Reached | ${compareLength}`,
          'school-name': institution.name,
        });
        dispatchShowModal('comparisonLimit');
      } else {
        recordEvent({
          event: 'gibct-form-change',
          'gibct-form-field': 'compareCheckbox',
          'gibct-form-value': `Add | ${compareLength + 1}`,
          'school-name': institution.name,
        });
        dispatchAddCompareInstitution(institution);
      }
    } else {
      recordEvent({
        event: 'gibct-form-change',
        'gibct-form-field': 'compareCheckbox',
        'gibct-form-value': `Remove | ${compareLength - 1}`,
        'school-name': institution.name,
      });
      dispatchRemoveCompareInstitution(facilityCode);
    }
  };

  const [expanded, toggleExpansion] = useState(false);

  const profileLink = version
    ? appendQuery(`/institution/${facilityCode}`, { version })
    : `/institution/${facilityCode}`;

  const resultCardClasses = classNames('result-card', {
    'vads-u-margin-bottom--2': location,
    'vads-u-padding-right--1': location && !active,
    'vads-u-padding--0p5': active,
    active,
  });

  const containerClasses = classNames({
    'vads-u-margin-bottom--2': !location,
    'small-screen:vads-u-margin-left--2p5': !location,
    'vads-u-margin--0': location,
    'vads-u-padding--0': location,
  });

  const nameClasses = classNames({
    'vads-u-margin-top--2': !location,
    'vads-u-margin-top--1': location,
  });

  const nameCityStateHeader = (
    <>
      <div>
        <h3 className={nameClasses} id={`label-${institution.facilityCode}`}>
          <Link
            to={profileLink}
            onClick={() =>
              recordEvent({
                event: 'gibct-view-profile',
                'school-name': name,
                'has-warnings': cautionFlags.length > 0,
              })
            }
          >
            {name}
            <span className="vads-u-visibility--screen-reader">
              {city}
              {state && `, ${state}`}
            </span>
          </Link>
        </h3>
      </div>
      <p className="vads-u-padding--0">
        {city}
        {state && `, ${state}`}
      </p>
    </>
  );

  // toggle for production/staging------------------------------------------------
  let ratingsInformation = false;
  if (isProduction) {
    const stars = convertRatingToStars(ratingAverage);
    const displayStars = stars && ratingCount >= MINIMUM_RATING_COUNT;

    ratingsInformation = displayStars ? (
      <div>
        <div className="vads-l-grid-container search-star-container">
          <div className="vads-u-margin-bottom--2 vads-l-row">
            <div className="star-icons">
              <RatingsStars rating={ratingAverage} />
            </div>
            <div className="xsmall-screen:vads-l-col--12 medium-screen:vads-l-col--8">
              <strong>
                {Math.round(10 * ratingAverage) / 10} out of 4 overall
              </strong>
            </div>
            <div className="vads-l-row">
              <div className="vads-l-col--12">
                <strong>{ratingCount} veterans rated this institution</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div>
        <p>
          <strong>Not yet rated by Veterans</strong>
        </p>
      </div>
    );
  }
  // end toggle for production/staging------------------------------------------------

  const estimate = ({ qualifier, value }) => {
    if (qualifier === '% of instate tuition') {
      return <span>{value}% in-state</span>;
    }
    if (qualifier === null) {
      return value;
    }
    const lesserVal = tuitionOutOfState
      ? Math.min(value, tuitionOutOfState)
      : value;
    return <span>{formatCurrency(lesserVal)}</span>;
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
          <p className="secondary-info-label-large">Tuition benefit:</p>
          <p className="vads-u-margin-y--0">{tuition}</p>
        </div>
        <div className="vads-u-flex--1">
          <p className="secondary-info-label-large">Housing benefit:</p>
          <p className="vads-u-margin-y--0">
            {housing} /mo
            {employerProvider && '*'}
          </p>
        </div>
      </div>
      {employerProvider && (
        <p className="asterisk-text">
          * Housing rate and the amount of entitlement used decrease every 6
          months as training progresses
        </p>
      )}
    </>
  );

  const schoolEmployerInstitutionDetails = (
    <>
      <div className="vads-u-flex--1">
        <p className="secondary-info-label-large">
          <strong>Accreditation:</strong>
        </p>
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--2p5">
          {(accreditationType && (
            <span className="capitalize-value">{accreditationType}</span>
          )) ||
            'N/A'}
        </p>
      </div>
      <div className="vads-u-flex--1">
        <p className="secondary-info-label-large">
          <strong>GI Bill students:</strong>
        </p>
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--2p5">
          {studentCount || '0'}
        </p>
      </div>
    </>
  );

  const programHours = () => {
    if (programLengthInHours && programLengthInHours.length > 0) {
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
        <p className="secondary-info-label-large">
          <strong>Approved programs:</strong>
        </p>
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--2p5">
          {programCount || 0}
        </p>
      </div>
      <div className="vads-u-flex--1">
        <p className="secondary-info-label-large">
          <strong>Program length:</strong>
        </p>
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--2p5">
          {programHours()}
        </p>
      </div>
    </>
  );

  return (
    <div
      key={institution.facilityCode}
      className={resultCardClasses}
      id={`${createId(name)}-result-card`}
    >
      <div className={containerClasses}>
        {location && <span id={`${createId(name)}-result-card-placeholder`} />}
        {header}
        <div className="result-card-container vads-u-background-color--gray-lightest">
          <SchoolClassification institution={institution} />
          <div className="vads-u-padding-x--2 vads-u-margin-bottom--1">
            {nameCityStateHeader}
            {schoolProvider && ratingsInformation}
            {preferredProvider && (
              <span className="preferred-provider-text">
                <va-icon icon="star" size={3} class="vads-u-color--gold" />
                <strong> Preferred Provider</strong>
              </span>
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
          <>
            {showSchoolContentBasedOnType(type) && (
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
            )}
            <div className="vads-u-border-top--3px vads-u-border-color--white vads-u-padding-x--2">
              <div className="vads-u-display--flex vads-u-margin-top--1 ">
                {!vetTecProvider
                  ? schoolEmployerInstitutionDetails
                  : vettecInstitutionDetails}
              </div>
            </div>
          </>

          <div
            className={classNames(
              'vads-u-display--flex, vads-u-text-align--center',
              {
                'vads-u-border-top--3px': !expanded,
                'vads-u-border-color--white': !expanded,
              },
            )}
          >
            <div className="card-bottom-cell vads-u-flex--1 vads-u-margin--0">
              <CompareCheckbox
                institution={name}
                cityState={`${city}${state && `, ${state}`}`}
                compareChecked={compareChecked}
                handleCompareUpdate={handleCompareUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  compare: state.compare,
  estimated: estimatedBenefits(state, props),
});

const mapDispatchToProps = {
  dispatchAddCompareInstitution: addCompareInstitution,
  dispatchRemoveCompareInstitution: removeCompareInstitution,
  dispatchShowModal: showModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultCard);
