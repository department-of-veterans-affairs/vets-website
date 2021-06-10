import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import {
  fetchProfile,
  setPageTitle,
  showModal,
  hideModal,
  fetchCompareDetails,
} from '../actions';
import { estimatedBenefits } from '../selectors/estimator';
import { convertRatingToStars, schoolSize } from '../utils/helpers';
import Checkbox from '../components/Checkbox';
import ServiceError from '../components/ServiceError';
import CompareGrid from '../components/CompareGrid';
import RatingsStars from '../components/RatingsStars';

export function ComparePage({
  allLoaded,
  compare,
  dispatchFetchCompareDetails,
  filters,
  preview,
}) {
  const [showDifferences, setShowDifferences] = useState(false);
  // const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);
  const { selected, error } = compare;
  const { loaded, institutions } = compare.details;
  const { version } = preview;
  const institutionCount = loaded.length;
  // const allLoaded = _.difference(selected, loaded).length === 0;

  useEffect(
    () => {
      if (!allLoaded) {
        dispatchFetchCompareDetails(selected, filters, version);
      }
    },
    [loaded, selected],
  );

  // const toggleSticky = useCallback(
  //   ({ top, bottom }) => {
  //     if (top <= 0 && bottom > 2 * 68 && !isSticky) {
  //       setIsSticky(true);
  //     } else if (isSticky) {
  //       setIsSticky(false);
  //     }
  //   },
  //   [isSticky],
  // );
  //
  // useLayoutEffect(
  //   () => {
  //     const handleScroll = () => {
  //       toggleSticky(headerRef.current.getBoundingClientRect());
  //     };
  //     window.addEventListener('scroll', handleScroll);
  //     return () => {
  //       window.removeEventListener('scroll', handleScroll);
  //     };
  //   },
  //   [toggleSticky],
  // );

  if (error) {
    return <ServiceError />;
  }

  if (!allLoaded) {
    return <LoadingIndicator message="Loading..." />;
  }

  const mapRating = (institution, categoryName) => {
    const categoryRating = institution.institutionCategoryRatings.filter(
      category => category.categoryName === categoryName,
    )[0];

    if (categoryRating) {
      const stars = convertRatingToStars(categoryRating.averageRating);
      return (
        <div>
          <RatingsStars rating={categoryRating.averageRating} /> {stars.display}
        </div>
      );
    } else {
      return 'N/A';
    }
  };

  const mapBoolField = field => {
    return field ? 'Yes' : 'No';
  };

  return (
    <div className="compare-page">
      <div className="content-wrapper">
        <div id="header-test" className="sticky" ref={headerRef}>
          <div className="row vads-l-grid-container">
            <div className="vads-l-row compare-header-row">
              <div className="medium-screen:vads-l-col--3">
                <div className="compare-header">
                  <div className="compare-page-description-label">
                    School comparison:
                  </div>
                  View school information side by side to compare schools
                </div>
                <div className="compare-action">
                  <Checkbox
                    checked={showDifferences}
                    className="vads-u-display--inline-block"
                    onChange={e => setShowDifferences(e.checked)}
                    label="Highlight differences"
                  />
                </div>
              </div>
              {loaded.map((facilityCode, index) => {
                const location =
                  institutions[facilityCode].country === 'USA'
                    ? `${institutions[facilityCode].city}, ${
                        institutions[facilityCode].state
                      }`
                    : `${institutions[facilityCode].city}, ${
                        institutions[facilityCode].country
                      }`;
                return (
                  <div className="medium-screen:vads-l-col--3" key={index}>
                    <div className="compare-header institution-header">
                      <div className="institution-name">
                        {institutions[facilityCode].name}
                      </div>
                      <div className="institution-location">{location}</div>
                    </div>
                    <div className="compare-action">
                      <button
                        type="button"
                        className="va-button-link learn-more-button"
                        onClick={() => {}}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
              {institutionCount === 2 && (
                <div className="medium-screen:vads-l-col--3">
                  <div className="compare-header empty-header" />
                  <div className="compare-action">
                    <button
                      type="button"
                      className="va-button-link learn-more-button"
                      onClick={() => {}}
                    >
                      Return to search to add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row vads-l-grid-container">
          <CompareGrid
            sectionLabel="Summary"
            institutions={institutions}
            facilityCodes={loaded}
            fieldData={[
              {
                label: 'Accreditation',
                className: 'capitalize-value',
                mapper: institution => institution.accreditationType,
              },
              {
                label: 'Gi Bill students',
                mapper: institution => institution.studentCount,
              },
              {
                label: 'Length of program',
                mapper: institution => {
                  return _.isFinite(institution.highestDegree)
                    ? `${institution.highestDegree} year`
                    : `${institution.highestDegree} program`;
                },
              },
              {
                label: 'Type of school',
                mapper: institution => {
                  if (institution.vetTecProvider) {
                    return 'VET TEC';
                  }
                  if (institution.type.toLowerCase()) {
                    return 'Employer';
                  }
                  return 'School';
                },
              },
              {
                label: 'Institution locale',
                className: 'capitalize-value',
                mapper: institution => institution.localeType,
              },
              {
                label: 'Size of school',
                mapper: institution =>
                  schoolSize(institution.undergradEnrollment),
              },
              {
                label: 'Specialized mission',
                mapper: institution => {
                  const specialMission = [];
                  if (institution.hbcu) {
                    specialMission.push('HBCU');
                  }
                  if (institution.relaffil) {
                    specialMission.push('Religious');
                  }
                  if (institution.womenOnly) {
                    specialMission.push('Women-only');
                  }
                  if (institution.menOnly) {
                    specialMission.push('Men-only');
                  }
                  return specialMission.length > 0
                    ? specialMission.join(', ')
                    : 'N/A';
                },
              },
            ]}
          />

          <CompareGrid
            sectionLabel="Your estimated benefits"
            sectionSublabel="Payments made to school"
            institutions={institutions}
            facilityCodes={loaded}
            fieldData={[
              {
                label: 'Tuition and fees',
                mapper: () => '',
              },
              {
                label: 'Gi Bill pays to school',
                mapper: () => '',
              },
              {
                label: 'Out of pocket tuition',
                mapper: () => '',
              },
            ]}
          />

          <CompareGrid
            sectionSublabel="Payments made to you"
            institutions={institutions}
            facilityCodes={loaded}
            fieldData={[
              {
                label: 'Housing allowance',
                mapper: () => '',
              },
              {
                label: 'Book stipend',
                mapper: () => '',
              },
            ]}
          />

          <CompareGrid
            sectionLabel="School ratings"
            institutions={institutions}
            facilityCodes={loaded}
            fieldData={[
              {
                label: 'Overall rating',
                className: 'vads-u-text-align--center',
                mapper: institution => {
                  const stars = convertRatingToStars(institution.ratingAverage);
                  if (stars) {
                    return (
                      <div className="vads-u-display--inline-block vads-u-text-align--center main-rating">
                        <div className="vads-u-font-weight--bold vads-u-font-size--2xl">
                          {stars.display}
                        </div>
                        <div className="vads-u-font-size--sm vads-u-padding-bottom--1">
                          out of a possible 5 stars
                        </div>
                        <div className="vads-u-font-size--lg">
                          <RatingsStars rating={institution.ratingAverage} />
                        </div>
                      </div>
                    );
                  } else {
                    return null;
                  }
                },
              },
              {
                label: '# of Veteran ratings',
                className: 'vads-u-text-align--center',
                mapper: institution => institution.ratingCount,
              },
            ]}
          />

          <CompareGrid
            sectionSublabel="Education ratings"
            institutions={institutions}
            facilityCodes={loaded}
            fieldData={[
              {
                label: 'Overall experience',
                mapper: institution =>
                  mapRating(institution, 'overall_experience'),
              },
              {
                label: 'Quality of classes',
                mapper: institution =>
                  mapRating(institution, 'quality_of_classes'),
              },
              {
                label: 'Online instruction',
                mapper: institution =>
                  mapRating(institution, 'online_instruction'),
              },
              {
                label: 'Job preparation',
                mapper: institution =>
                  mapRating(institution, 'job_preparation'),
              },
            ]}
          />

          <CompareGrid
            sectionSublabel="Veteran friendliness"
            institutions={institutions}
            facilityCodes={loaded}
            fieldData={[
              {
                label: 'Gi Bill support',
                mapper: institution =>
                  mapRating(institution, 'gi_bill_support'),
              },
              {
                label: 'Veteran community',
                mapper: institution =>
                  mapRating(institution, 'veteran_community'),
              },
              {
                label: 'True to expectations',
                mapper: institution =>
                  mapRating(institution, 'marketing_practices'),
              },
            ]}
          />

          <CompareGrid
            sectionLabel="Cautionary information"
            institutions={institutions}
            facilityCodes={loaded}
            fieldData={[
              {
                label: 'Caution flags',
                mapper: institution => {
                  const classes = classNames('caution-flag-display', {
                    none: institution.cautionFlags.length === 0,
                  });
                  return (
                    <div className={classes}>
                      {institution.cautionFlags.length === 0 && (
                        <div>This school doesn't have any caution flags</div>
                      )}
                    </div>
                  );
                },
              },
              {
                label: 'Student complaints',
                mapper: institution => +institution.complaints.mainCampusRollUp,
              },
            ]}
          />

          <CompareGrid
            sectionLabel="Academics"
            institutions={institutions}
            facilityCodes={loaded}
            fieldData={[
              {
                label: 'Credit for military training',
                mapper: institution =>
                  mapBoolField(institution.creditForMilTraining),
              },
            ]}
          />

          <CompareGrid
            sectionLabel="Veteran programs"
            institutions={institutions}
            facilityCodes={loaded}
            fieldData={[
              {
                label: 'Yellow Ribbon',
                mapper: institution => mapBoolField(institution.yr),
              },
              {
                label: 'Student Veteran Group',
                mapper: institution => mapBoolField(institution.studentVeteran),
              },
              {
                label: 'Principles of Excellence',
                mapper: institution => mapBoolField(institution.poe),
              },
              {
                label: '8 Keys to Veteran Success',
                mapper: institution => mapBoolField(institution.eightKeys),
              },
              {
                label: 'Military Tuition Assistance (TA)',
                mapper: institution => mapBoolField(institution.dodmou),
              },
              {
                label: 'PriorityEnrollment',
                mapper: institution =>
                  mapBoolField(institution.priorityEnrollment),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  const allLoaded =
    _.difference(state.compare.selected, state.compare.details.loaded)
      .length === 0;
  const estimated = {};

  if (allLoaded) {
    state.compare.selected.forEach(facilityCode => {
      estimated[facilityCode] = estimatedBenefits(state, {
        institution: state.compare.details.institutions[facilityCode],
      });
    });
  }

  return {
    allLoaded,
    compare: state.compare,
    estimated,
    filters: state.filters,
    preview: state.preview,
  };
};

const mapDispatchToProps = {
  dispatchFetchCompareDetails: fetchCompareDetails,
  dispatchFetchProfile: fetchProfile,
  dispatchSetPageTitle: setPageTitle,
  dispatchShowModal: showModal,
  dispatchHideModal: hideModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComparePage);
