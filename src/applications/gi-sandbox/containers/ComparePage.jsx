import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import appendQuery from 'append-query';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  fetchProfile,
  setPageTitle,
  showModal,
  hideModal,
  fetchCompareDetails,
  removeCompareInstitution,
} from '../actions';
import { estimatedBenefits } from '../selectors/estimator';
import { getCalculatedBenefits } from '../selectors/calculator';
import { getCompareCalculatorState } from '../selectors/compare';
import {
  convertRatingToStars,
  formatCurrency,
  schoolSize,
} from '../utils/helpers';
import Checkbox from '../components/Checkbox';
import ServiceError from '../components/ServiceError';
import CompareGrid from '../components/CompareGrid';
import RatingsStars from '../components/RatingsStars';
import RemoveCompareSelectedModal from '../components/RemoveCompareSelectedModal';
import { MINIMUM_RATING_COUNT } from '../constants';
import Scroll from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';

const scroll = Scroll.animateScroll;

export function ComparePage({
  allLoaded,
  compare,
  dispatchFetchCompareDetails,
  dispatchRemoveCompareInstitution,
  estimated,
  filters,
  gibctSchoolRatings,
  preview,
  calculated,
}) {
  const [showDifferences, setShowDifferences] = useState(false);
  const [promptingFacilityCode, setPromptingFacilityCode] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [initialTop, setInitialTop] = useState(null);
  const headerRef = useRef(null);
  const { selected, error } = compare;
  const { loaded, institutions } = compare.details;
  const { version } = preview;
  const institutionCount = loaded.length;
  const history = useHistory();

  useEffect(() => {
    if (!allLoaded) {
      dispatchFetchCompareDetails(selected, filters, version);
    }
  }, [loaded, selected]);

  const toggleSticky = useCallback(
    offset => {
      if (!initialTop) {
        const header = headerRef.current;
        if (header) {
          const checkPos = header.offsetTop;
          if (checkPos) {
            setInitialTop(checkPos);
          }
        }
      }

      if (initialTop) {
        if (offset > initialTop && !isSticky) {
          setIsSticky(true);
        } else if (offset < initialTop && isSticky) {
          setIsSticky(false);
        }
      }
    },
    [isSticky, initialTop],
  );

  useEffect(() => {
    scroll.scrollToTop(getScrollOptions());
  }, []);

  useLayoutEffect(() => {
    const handleScroll = () => {
      toggleSticky(window.pageYOffset);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headerRef, toggleSticky]);

  if (error) {
    return <ServiceError />;
  }

  if (!allLoaded) {
    return <LoadingIndicator message="Loading..." />;
  }

  let hasRatings = false;
  const loadedInstitutions = [];
  for (let i = 0; i < loaded.length; i++) {
    loadedInstitutions.push(institutions[loaded[i]]);
    if (
      institutions[loaded[i]].institutionCategoryRatings.length > 0 &&
      institutions[loaded[i]].ratingCount >= MINIMUM_RATING_COUNT
    ) {
      hasRatings = true;
    }
  }

  const mapRating = (institution, categoryName) => {
    const categoryRatings = institution.institutionCategoryRatings.filter(
      category => category.categoryName === categoryName,
    );

    if (
      categoryRatings.length > 0 &&
      categoryRatings[0].averageRating &&
      institution.ratingCount >= MINIMUM_RATING_COUNT
    ) {
      const categoryRating = categoryRatings[0];
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

  const naIfNull = value => {
    return value || 'N/A';
  };

  const mapBoolField = field => {
    return field ? 'Yes' : 'No';
  };

  const formatEstimate = ({ qualifier, value }) => {
    if (qualifier === '% of instate tuition') {
      return <span>{value}% in-state</span>;
    } else if (qualifier === null) {
      return value;
    }
    return <span>{formatCurrency(value)}</span>;
  };

  const empties = [];
  for (let i = 0; i < 3 - institutionCount; i++) {
    empties.push(
      <div key={i} className="medium-screen:vads-l-col--3">
        <div className="compare-header empty-header" />
        <div className="compare-action">
          <Link to={'/search'}>Return to search to add</Link>
        </div>
      </div>,
    );
  }

  const programHours = programLength => {
    if (!programLength) return 'N/A';

    const maxHours = Math.max(...programLength);
    const minHours = Math.min(...programLength);
    if (
      programLength &&
      programLength.length > 0 &&
      maxHours + minHours !== 0
    ) {
      return `${
        minHours === maxHours ? minHours : `${minHours} - ${maxHours}`
      } hours`;
    }
    return 'N/A';
  };

  return (
    <div className="compare-page">
      {promptingFacilityCode && (
        <RemoveCompareSelectedModal
          name={institutions[promptingFacilityCode].name}
          onClose={() => setPromptingFacilityCode(null)}
          onAccept={() => {
            setPromptingFacilityCode(null);
            const newSelected = selected.filter(
              facilityCode => facilityCode !== promptingFacilityCode,
            );
            const compareLink = appendQuery(
              `/compare/?facilities=${newSelected.join(',')}`,
            );
            history.replace(compareLink);
            dispatchRemoveCompareInstitution(promptingFacilityCode);
          }}
          onCancel={() => setPromptingFacilityCode(null)}
        />
      )}
      <div className="content-wrapper">
        <div
          id="compare-header"
          className={classNames({
            sticky: isSticky,
          })}
          ref={headerRef}
        >
          <div className="row vads-l-grid-container">
            <div className="vads-l-row compare-header-row vads-u-padding-bottom--6">
              <div className="medium-screen:vads-l-col--3">
                <div className="compare-header vads-u-padding-right--1">
                  <div className="compare-page-description-label">
                    School comparison:
                  </div>
                  View school information side by side to compare schools
                </div>
                <div className="compare-action">
                  <Checkbox
                    checked={showDifferences}
                    label="Highlight differences"
                    name="highlight-differences"
                    className="vads-u-display--inline-block"
                    onChange={e => setShowDifferences(e.target.checked)}
                  />
                </div>
              </div>
              {loadedInstitutions.map((institution, index) => {
                const location =
                  institution.country === 'USA'
                    ? `${institution.city}, ${institution.state}`
                    : `${institution.city}, ${institution.country}`;
                return (
                  <div className="medium-screen:vads-l-col--3" key={index}>
                    <div className="compare-header institution-header">
                      <div className="institution-name">{institution.name}</div>
                      {!isSticky && (
                        <div className="institution-location">{location}</div>
                      )}
                    </div>
                    <div className="compare-action">
                      <button
                        type="button"
                        className="va-button-link learn-more-button"
                        onClick={() => {
                          setPromptingFacilityCode(institution.facilityCode);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
              {empties}
            </div>
          </div>
        </div>

        <div className="row vads-l-grid-container">
          <CompareGrid
            sectionLabel="Summary"
            institutions={loadedInstitutions}
            showDifferences={showDifferences}
            fieldData={[
              {
                label: 'Accreditation',
                className: 'capitalize-value',
                mapper: institution => naIfNull(institution.accreditationType),
              },
              {
                label: 'GI Bill students',
                mapper: institution => naIfNull(institution.studentCount),
              },
              {
                label: 'Length of program',
                mapper: institution => {
                  if (!institution.highestDegree) {
                    return 'N/A';
                  }

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
                  if (institution.type.toLowerCase() === 'ojt') {
                    return 'Employer';
                  }
                  return 'School';
                },
              },
              {
                label: 'Institution locale',
                className: 'capitalize-value',
                mapper: institution => naIfNull(institution.localeType),
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
            subSectionLabel="Payments made to school"
            institutions={loadedInstitutions}
            showDifferences={showDifferences}
            fieldData={[
              {
                label: 'Tuition and fees',
                mapper: institution =>
                  formatCurrency(
                    calculated[institution.facilityCode].outputs
                      .tuitionAndFeesCharged.value,
                  ),
              },
              {
                label: 'GI Bill pays to school',
                mapper: institution =>
                  formatCurrency(
                    calculated[institution.facilityCode].outputs
                      .giBillPaysToSchool.value,
                  ),
              },
              {
                label: 'Out of pocket tuition',
                mapper: institution =>
                  formatCurrency(
                    calculated[institution.facilityCode].outputs
                      .outOfPocketTuition.value,
                  ),
              },
            ]}
          />

          <CompareGrid
            subSectionLabel="Payments made to you"
            institutions={loadedInstitutions}
            showDifferences={showDifferences}
            fieldData={[
              {
                label: 'Housing allowance',
                mapper: institution =>
                  formatEstimate(estimated[institution.facilityCode].housing),
              },
              {
                label: 'Book stipend',
                mapper: institution =>
                  formatEstimate(estimated[institution.facilityCode].books),
              },
            ]}
          />

          {gibctSchoolRatings && hasRatings && (
            <>
              <CompareGrid
                sectionLabel="School ratings"
                institutions={loadedInstitutions}
                showDifferences={showDifferences}
                fieldData={[
                  {
                    label: 'Overall rating',
                    className: 'vads-u-text-align--center',
                    mapper: institution => {
                      const stars = convertRatingToStars(
                        institution.ratingAverage,
                      );
                      const aboveMinimumRatingCount =
                        institution.ratingCount >= MINIMUM_RATING_COUNT;

                      return (
                        <div className="vads-u-display--inline-block vads-u-text-align--center main-rating">
                          <div className="vads-u-font-weight--bold vads-u-font-size--2xl vads-u-font-family--serif">
                            {aboveMinimumRatingCount && stars && stars.display}
                            {(!aboveMinimumRatingCount || !stars) && (
                              <span>N/A</span>
                            )}
                          </div>
                          <div className="vads-u-font-size--sm vads-u-padding-bottom--1">
                            {aboveMinimumRatingCount && stars && (
                              <span>out of a possible 5 stars</span>
                            )}
                            {(!aboveMinimumRatingCount || !stars) && (
                              <span>not yet rated</span>
                            )}
                          </div>
                          {aboveMinimumRatingCount && stars && (
                            <div className="vads-u-font-size--lg">
                              <RatingsStars
                                rating={institution.ratingAverage}
                              />
                            </div>
                          )}
                        </div>
                      );
                    },
                  },
                  {
                    label: '# of Veteran ratings',
                    className: 'vads-u-text-align--center',
                    mapper: institution =>
                      institution.ratingCount >= MINIMUM_RATING_COUNT
                        ? institution.ratingCount
                        : '0',
                  },
                ]}
              />

              <CompareGrid
                subSectionLabel="Education ratings"
                institutions={loadedInstitutions}
                showDifferences={showDifferences}
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
                subSectionLabel="Veteran friendliness"
                institutions={loadedInstitutions}
                showDifferences={showDifferences}
                fieldData={[
                  {
                    label: 'GI Bill support',
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
                institutions={loadedInstitutions}
                fieldData={[
                  {
                    label: 'Caution flags',
                    className: institution =>
                      classNames('caution-flag-display', {
                        none: institution.cautionFlags.length === 0,
                      }),
                    mapper: institution => {
                      const hasFlags = institution.cautionFlags.length > 0;
                      return (
                        <div className="vads-u-display--flex">
                          <div className="caution-flag-icon vads-u-flex--1">
                            {!hasFlags && <i className={`fa fa-check`} />}
                            {hasFlags && (
                              <i className={`fa fa-exclamation-triangle`} />
                            )}
                          </div>
                          <div className="vads-u-flex--4">
                            <div className="caution-header">
                              {!hasFlags && (
                                <span>
                                  This school doesn't have any caution flags
                                </span>
                              )}
                              {hasFlags && (
                                <span>
                                  This school has{' '}
                                  {institution.cautionFlags.length} cautionary
                                  warning
                                  {institution.cautionFlags.length > 1 && 's'}
                                </span>
                              )}
                            </div>
                            {hasFlags && (
                              <div>
                                <ul>
                                  {institution.cautionFlags.map(
                                    (cautionFlag, index) => {
                                      return (
                                        <li key={index}>{cautionFlag.title}</li>
                                      );
                                    },
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    },
                  },
                ]}
              />
            </>
          )}

          <CompareGrid
            sectionLabel=""
            className="vads-u-margin-top--4"
            institutions={loadedInstitutions}
            showDifferences={showDifferences}
            fieldData={[
              {
                label: 'Student complaints',
                mapper: institution => +institution.complaints.mainCampusRollUp,
              },
            ]}
          />

          <CompareGrid
            sectionLabel="Academics"
            institutions={loadedInstitutions}
            showDifferences={showDifferences}
            fieldData={[
              {
                label: 'Length of VET TEC programs',
                mapper: institution =>
                  programHours(institution.programLengthInHours),
              },
              {
                label: 'Credit for military training',
                mapper: institution =>
                  mapBoolField(institution.creditForMilTraining),
              },
            ]}
          />

          <CompareGrid
            sectionLabel="Veteran programs"
            institutions={loadedInstitutions}
            showDifferences={showDifferences}
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
                label: 'Priority Enrollment',
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
  const calculated = {};

  if (allLoaded) {
    state.compare.selected.forEach(facilityCode => {
      estimated[facilityCode] = estimatedBenefits(state, {
        institution: state.compare.details.institutions[facilityCode],
      });
      calculated[facilityCode] = getCalculatedBenefits({
        ...state,
        calculator: getCompareCalculatorState(
          state.calculator,
          state.compare.details.institutions[facilityCode],
          state.constants,
        ),
        profile: {
          attributes: state.compare.details.institutions[facilityCode],
        },
      });
    });
  }

  return {
    allLoaded,
    compare: state.compare,
    estimated,
    calculated,
    filters: state.filters,
    gibctSchoolRatings: toggleValues(state)[
      FEATURE_FLAG_NAMES.gibctSchoolRatings
    ],
    preview: state.preview,
  };
};

const mapDispatchToProps = {
  dispatchFetchCompareDetails: fetchCompareDetails,
  dispatchFetchProfile: fetchProfile,
  dispatchRemoveCompareInstitution: removeCompareInstitution,
  dispatchSetPageTitle: setPageTitle,
  dispatchShowModal: showModal,
  dispatchHideModal: hideModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ComparePage);
