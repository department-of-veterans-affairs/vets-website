import React from 'react';
import {
  titleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { AddStudentsIntro } from './helpers';
import { CancelButton } from '../../helpers';
import { getFullName } from '../../../../shared/utils';

/** @type {ArrayBuilderOptions} */
export const addStudentsOptions = {
  arrayPath: 'studentInformation',
  nounSingular: 'student',
  nounPlural: 'students',
  required: true,
  isItemIncomplete: item =>
    !item?.fullName?.first ||
    !item?.fullName?.last ||
    !item?.birthDate ||
    (!item?.noSsn && !item?.ssn) ||
    (item?.noSsn && !item?.noSsnReason) ||
    (item?.isParent === true && !item?.isParent) ||
    !item?.address?.country ||
    !item?.address?.street ||
    !item?.address?.city ||
    !item?.address?.state ||
    !item?.address?.postalCode ||
    (item?.wasMarried === true && !item?.marriageDate) ||
    !item?.schoolInformation?.name ||
    (item?.schoolInformation?.studentIsEnrolledFullTime === true &&
      !item?.schoolInformation?.studentIsEnrolledFullTime) ||
    item?.schoolInformation?.isSchoolAccredited == null ||
    !item?.schoolInformation?.currentTermDates?.officialSchoolStartDate ||
    !item?.schoolInformation?.currentTermDates?.expectedStudentStartDate ||
    !item?.schoolInformation?.currentTermDates?.expectedGraduationDate ||
    (item?.schoolInformation?.studentDidAttendSchoolLastTerm === true &&
      !item?.schoolInformation?.studentDidAttendSchoolLastTerm) ||
    (item?.claimsOrReceivesPension !== undefined &&
      ![true, false].includes(item?.claimsOrReceivesPension)) ||
    (item?.schoolInformation?.studentDidAttendSchoolLastTerm === true &&
      (!item?.schoolInformation?.lastTermSchoolInformation?.termBegin ||
        !item?.schoolInformation?.lastTermSchoolInformation?.dateTermEnded)) ||
    (item?.typeOfProgramOrBenefit &&
      ['ch35', 'fry', 'feca'].some(
        key => item?.typeOfProgramOrBenefit?.[key] === true,
      ) &&
      !item?.benefitPaymentDate),
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
