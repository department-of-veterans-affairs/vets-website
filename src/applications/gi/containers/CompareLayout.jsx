import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';
import environment from 'platform/utilities/environment';
import CompareGrid from '../components/CompareGrid';
import {
  boolYesNo,
  convertRatingToStars,
  formatCurrency,
  isShowVetTec,
  naIfNull,
  schoolSize,
  upperCaseFirstLetterOnly,
} from '../utils/helpers';
import { MINIMUM_RATING_COUNT } from '../constants';
import RatingsStars from '../components/profile/schoolRatings/RatingsStars';
import { showModal } from '../actions';
import { religiousAffiliations } from '../utils/data/religiousAffiliations';
import {
  AccreditationModalContent,
  GiBillStudentsModalContent,
  SizeOfInstitutionsModalContent,
  SpecializedMissionModalContent,
  TuitionAndFeesModalContent,
  HousingAllowanceSchoolModalContent,
  BookStipendInfoModalContent,
  CautionFlagsModalContent,
  StudentComplaintsModalContent,
  MilitaryTrainingCreditModalContent,
  YellowRibbonModalContent,
  StudentVeteranGroupModalContent,
  PrinciplesOfExcellenceModalContent,
  EightKeysModalContent,
  MilitaryTuitionAssistanceModalContent,
  PriorityEnrollmentModalContent,
} from '../components/content/modals';

export const renFieldData = (programHours, automatedTest = false) => {
  if (isShowVetTec(automatedTest)) {
    return [
      {
        label: 'Length of VET TEC programs',
        mapper: institution => programHours(institution.programLengthInHours),
      },
      {
        label: 'Credit for military training',
        mapper: institution => boolYesNo(institution.creditForMilTraining),
      },
    ];
  }
  return [
    {
      label: 'Credit for military training',
      mapper: institution => boolYesNo(institution.creditForMilTraining),
    },
  ];
};

const CompareLayout = ({
  calculated,
  estimated,
  institutions,
  showDifferences,
  smallScreen,
}) => {
  // environment variable to keep ratings out of production until ready
  const isProduction = !environment.isProduction();
  const mapRating = institution => {
    const { type } = institution; // used to identify if the training is OJT
    let ratingAverage = false;
    let ratingCount = -1;
    let institutionRatingIsNotNull = false;
    let institutionCountIsNotNull = false;
    let institutionOverallAvgIsNotNull = false;
    const ratingsAriaLabel = `Overall rating for ${
      institution.name
    } has not yet been rated by veterans`;
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
      ratingAverage = overallAvg;
      ratingCount = institutionRatingCount;
    }
    /// /////////////////////////////////////////////////////////////////////

    if (ratingAverage && ratingCount >= MINIMUM_RATING_COUNT) {
      const stars = convertRatingToStars(ratingAverage);
      return (
        <div>
          <div
            aria-label={`Overall Rating for ${institution.name} is ${
              stars.display
            } out of 4.`}
          >
            {stars.display} out of a possible 4 stars
          </div>
          <div>
            <RatingsStars rating={ratingAverage} />{' '}
          </div>
        </div>
      );
    }
    if (type.toUpperCase() === 'OJT') {
      return (
        <div
          aria-label={`Overall rating not applicable for ${institution.name}`}
        >
          N/A
        </div>
      );
    }

    return <div aria-label={ratingsAriaLabel}>Not yet rated by Veterans</div>;
  };

  const formatEstimate = ({ qualifier, value }) => {
    if (qualifier === '% of instate tuition') {
      return <span>{value}% in-state</span>;
    }
    if (qualifier === null) {
      return value;
    }
    return <span>{formatCurrency(value)}</span>;
  };

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

  const fieldDataSummary = [
    {
      label: 'Location',
      className: 'capitalize-value',
      mapper: institution => {
        return institution.country === 'USA'
          ? `${institution.city}, ${institution.state}`
          : `${institution.city}, ${institution.country}`;
      },
    },
    {
      label: 'Overall rating',
      mapper: institution => mapRating(institution),
    },
    {
      label: 'Accreditation',
      className: 'capitalize-value',
      mapper: institution => naIfNull(institution.accreditationType),
    },
    {
      label: 'GI Bill students',
      className: 'capitalize-value',
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
      label: 'Type of institution',
      mapper: institution => {
        if (institution.vetTecProvider) {
          return 'VET TEC';
        }
        if (institution.type.toLowerCase() === 'ojt') {
          return 'Employer';
        }
        return `${upperCaseFirstLetterOnly(institution.type)} school`;
      },
    },
    {
      label: 'Institution locale',
      className: 'capitalize-value',
      mapper: institution => naIfNull(institution.localeType),
    },
    {
      label: 'Size of institution',
      className: 'capitalize-value',
      mapper: institution => schoolSize(institution.undergradEnrollment),
    },
    {
      label: 'Community focus',
      className: 'capitalize-value',
      mapper: institution => {
        const specialMission = [];
        if (institution.hbcu) {
          specialMission.push('Historically Black Colleges and Universities');
        }
        if (institution.relaffil) {
          specialMission.push(religiousAffiliations[institution.relaffil]);
        }
        if (institution.womenonly) {
          specialMission.push('Women’s colleges and universities');
          // specialMission.push('Women-only');
        }
        if (institution.menonly) {
          specialMission.push('Men’s colleges and universities');
        }
        return specialMission.length > 0 ? specialMission.join(', ') : 'N/A';
      },
    },
  ];

  return (
    <div className={classNames({ 'row vads-l-grid-container': !smallScreen })}>
      <CompareGrid
        sectionLabel="Summary"
        institutions={institutions}
        showDifferences={showDifferences}
        smallScreen={smallScreen}
        fieldData={
          isProduction
            ? fieldDataSummary
            : fieldDataSummary.filter(
                value => value.label.toUpperCase() !== 'OVERALL RATING',
              )
        }
      />
      <va-additional-info trigger="Additional information on comparison summary fields">
        <AccreditationModalContent />
        <GiBillStudentsModalContent />
        <SizeOfInstitutionsModalContent />
        <SpecializedMissionModalContent />
      </va-additional-info>

      <CompareGrid
        sectionLabel="Your estimated benefits"
        subSectionLabel="Payments made to institution"
        institutions={institutions}
        showDifferences={showDifferences}
        smallScreen={smallScreen}
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
            label: 'GI Bill pays to institution',
            mapper: institution =>
              formatCurrency(
                calculated[institution.facilityCode].outputs.giBillPaysToSchool
                  .value,
              ),
          },
          {
            label: 'Out of pocket tuition',
            mapper: institution =>
              formatCurrency(
                calculated[institution.facilityCode].outputs.outOfPocketTuition
                  .value,
              ),
          },
        ]}
      />

      <va-additional-info trigger="Additional information on payments made to institution fields">
        <TuitionAndFeesModalContent />
      </va-additional-info>

      <CompareGrid
        subSectionLabel="Payments made to you"
        institutions={institutions}
        showDifferences={showDifferences}
        smallScreen={smallScreen}
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
      <va-additional-info trigger="Additional information on payments made to you fields">
        <HousingAllowanceSchoolModalContent />
        <BookStipendInfoModalContent />
      </va-additional-info>

      {/* ////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      {/* LEAVING CODE IN UNTIL EDU APPROVES DELETION */}
      {/* {//gibctSchoolRatings && used for toggle, rework this before pushing to staging
        (
          <>
            <CompareGrid
              sectionLabel="Veteran ratings"
              institutions={institutions}
              showDifferences={showDifferences}
              smallScreen={smallScreen}
              fieldData={[
                {
                  label: 'Overall rating',
                  className: 'vads-u-text-align--center rating-value',
                  mapper: institution => {
                    const stars = convertRatingToStars(
                      // institution.ratingAverage,
                      ratingAverage
                    );
                    const aboveMinimumRatingCount =
                      // institution.ratingCount >= MINIMUM_RATING_COUNT;
                      ratingCount >= MINIMUM_RATING_COUNT;

                    return (
                      <div className="vads-u-display--inline-block vads-u-text-align--center main-rating">
                        <div className="vads-u-font-weight--bold vads-u-font-size--2xl vads-u-font-family--serif">
                          {aboveMinimumRatingCount && stars && stars.display}
                          {(!aboveMinimumRatingCount || !stars) && (
                            <span>N/A</span>
                          )}
                        </div>
                        <div className="vads-u-font-size--sm vads-u-padding-bottom--1">
                          {aboveMinimumRatingCount &&
                            stars && <span>out of a possible 4 stars</span>}
                          {(!aboveMinimumRatingCount || !stars) && (
                            <span>not yet rated</span>
                          )}
                        </div>
                        {aboveMinimumRatingCount &&
                          stars && (
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
                  className: () =>
                    !smallScreen ? 'vads-u-text-align--center' : '',
                  mapper: institution =>
                    // institution.ratingCount >= MINIMUM_RATING_COUNT
                    //   ? institution.ratingCount
                    ratingCount >= MINIMUM_RATING_COUNT
                      ? ratingCount
                      : '0',
                },
              ]}
            /> */}
      {/* <CompareGrid
              subSectionLabel="Education ratings"
              institutions={institutions}
              showDifferences={showDifferences}
              smallScreen={smallScreen}
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
            />S

            <CompareGrid
              subSectionLabel="Veteran friendliness"
              institutions={institutions}
              showDifferences={showDifferences}
              smallScreen={smallScreen}
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
          </>
        )} */}
      {/* ////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      <CompareGrid
        sectionLabel="Cautionary information"
        institutions={institutions}
        smallScreen={smallScreen}
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
                    {!hasFlags && (
                      <va-icon size={4} icon="check" class="display-none" />
                    )}
                    {hasFlags && <va-icon size={3} icon="warning" />}
                  </div>
                  <div className="vads-u-flex--4">
                    {!hasFlags && (
                      <div className="caution-header">
                        <span>This school doesn’t have any caution flags</span>
                      </div>
                    )}
                    {hasFlags && (
                      <div className="caution-header">
                        <span>
                          This school has {institution.cautionFlags.length}{' '}
                          cautionary warning
                          {institution.cautionFlags.length > 1 && 's'}
                        </span>
                      </div>
                    )}
                    {hasFlags && (
                      <div>
                        <ul>
                          {institution.cautionFlags.map(
                            (cautionFlag, index) => {
                              return <li key={index}>{cautionFlag.title}</li>;
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

      <CompareGrid
        sectionLabel=""
        className={classNames({ 'vads-u-margin-top--4': !smallScreen })}
        institutions={institutions}
        showDifferences={showDifferences}
        smallScreen={smallScreen}
        fieldData={[
          {
            label: 'Student complaints',
            mapper: institution => +institution.complaints.mainCampusRollUp,
          },
        ]}
      />
      <va-additional-info trigger="Additional information on cautionary information fields">
        <CautionFlagsModalContent />
        <StudentComplaintsModalContent />
      </va-additional-info>

      <CompareGrid
        sectionLabel="Academics"
        institutions={institutions}
        showDifferences={showDifferences}
        smallScreen={smallScreen}
        fieldData={renFieldData(programHours)}
      />
      <va-additional-info trigger="Additional information on academics fields">
        <MilitaryTrainingCreditModalContent />
      </va-additional-info>

      <CompareGrid
        sectionLabel="Veteran programs"
        institutions={institutions}
        showDifferences={showDifferences}
        smallScreen={smallScreen}
        fieldData={[
          {
            label: 'Yellow Ribbon',
            mapper: institution => boolYesNo(institution.yr),
          },
          {
            label: 'Student Veteran Group',
            mapper: institution => boolYesNo(institution.studentVeteran),
          },
          {
            label: 'Principles of Excellence',
            mapper: institution => boolYesNo(institution.poe),
          },
          {
            label: '8 Keys to Veteran Success',
            mapper: institution => boolYesNo(institution.eightKeys),
          },
          {
            label: 'Military Tuition Assistance (TA)',
            mapper: institution => boolYesNo(institution.dodmou),
          },
          {
            label: 'Priority Enrollment',
            mapper: institution => boolYesNo(institution.priorityEnrollment),
          },
        ]}
      />
      <va-additional-info
        trigger="Additional information on veteran programs fields"
        class="vads-u-margin-bottom--4"
      >
        <YellowRibbonModalContent />
        <StudentVeteranGroupModalContent />
        <PrinciplesOfExcellenceModalContent />
        <EightKeysModalContent />
        <MilitaryTuitionAssistanceModalContent />
        <PriorityEnrollmentModalContent />
      </va-additional-info>
    </div>
  );
};

const mapDispatchToProps = {
  dispatchShowModal: showModal,
};
CompareLayout.propTypes = {
  calculated: PropTypes.object.isRequired,
  estimated: PropTypes.object.isRequired,
  institutions: PropTypes.array.isRequired,
  showDifferences: PropTypes.bool,
  smallScreen: PropTypes.bool,
};
export default connect(
  null,
  mapDispatchToProps,
)(CompareLayout);
