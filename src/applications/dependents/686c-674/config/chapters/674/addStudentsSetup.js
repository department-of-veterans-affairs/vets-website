import React from 'react';
import {
  titleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { AddStudentsIntro } from './helpers';
import { CancelButton } from '../../helpers';
import { getFullName } from '../../../../shared/utils';

/**
 * Determines if a student item is missing required fields.
 * Used by the array builder to flag items that need more information.
 *
 * @param {object} item - Student item data
 * @returns {boolean} true if incomplete, false if all required fields are present
 */
export function isStudentItemIncomplete(item) {
  // Identity
  if (!item?.fullName?.first || !item?.fullName?.last) return true;
  if (!item?.birthDate) return true;
  if (!item?.noSsn && !item?.ssn) return true;
  if (item?.noSsn && !item?.noSsnReason) return true;

  // Address - state is only required for US addresses
  if (
    !item?.address?.country ||
    !item?.address?.street ||
    !item?.address?.city ||
    !item?.address?.postalCode
  )
    return true;
  if (item?.address?.country === 'USA' && !item?.address?.state) return true;

  // Marriage
  if (item?.wasMarried === true && !item?.marriageDate) return true;

  // Education benefits
  if (item?.tuitionIsPaidByGovAgency === true && !item?.schoolInformation?.name)
    return true;
  if (
    (['ch35', 'fry', 'feca'].includes(item?.typeOfProgramOrBenefit) ||
      item?.tuitionIsPaidByGovAgency === true) &&
    !item?.benefitPaymentDate
  )
    return true;

  // School attendance
  if (item?.schoolInformation?.studentIsEnrolledFullTime == null) return true;
  if (item?.schoolInformation?.isSchoolAccredited == null) return true;
  if (
    !item?.schoolInformation?.currentTermDates?.officialSchoolStartDate ||
    !item?.schoolInformation?.currentTermDates?.expectedStudentStartDate ||
    !item?.schoolInformation?.currentTermDates?.expectedGraduationDate
  )
    return true;

  // Previous term
  if (item?.schoolInformation?.studentDidAttendSchoolLastTerm == null)
    return true;
  if (
    item?.schoolInformation?.studentDidAttendSchoolLastTerm === true &&
    (!item?.schoolInformation?.lastTermSchoolInformation?.termBegin ||
      !item?.schoolInformation?.lastTermSchoolInformation?.dateTermEnded)
  )
    return true;

  // Pension (if set, must be boolean)
  if (
    item?.claimsOrReceivesPension !== undefined &&
    ![true, false].includes(item?.claimsOrReceivesPension)
  )
    return true;

  return false;
}

/** @type {ArrayBuilderOptions} */
export const addStudentsOptions = {
  arrayPath: 'studentInformation',
  nounSingular: 'student',
  nounPlural: 'students',
  required: true,
  isItemIncomplete: isStudentItemIncomplete,
  maxItems: 20,
  text: {
    summaryTitle: 'Review your students',
    getItemName: item => getFullName(item.fullName),
  },
};

export const addStudentsIntroPage = {
  uiSchema: {
    ...titleUI('Your students'),
    'ui:description': () => (
      <>
        {AddStudentsIntro}
        <CancelButton dependentType="students" isAddChapter />
      </>
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
export const addStudentsSummaryPage = {
  uiSchema: {
    'view:completedStudent': arrayBuilderYesNoUI(
      addStudentsOptions,
      {
        title: 'Do you have a student to add?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have another student to add?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:completedStudent': arrayBuilderYesNoSchema,
    },
    required: ['view:completedStudent'],
  },
};
