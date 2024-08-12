import React from 'react';
import moment from 'moment';
import { differenceInYears } from 'date-fns';
import * as options from 'platform/static-data/options-for-select';
import {
  questionLabels,
  prevApplicationYearCutoff,
  BCMR,
  BCNR,
  DRB,
  AFDRB,
} from '../constants';
import { SHORT_NAME_MAP, RESPONSES } from '../constants/question-data-map';

export const shouldShowQuestion = (currentKey, validQuestions) => {
  const lastQuestion = validQuestions[validQuestions.length - 1];
  const num = currentKey.split('_')[0];
  const nextNum = lastQuestion.split('_')[0];

  const isValid = validQuestions.indexOf(currentKey) > -1;
  const isNotFutureQuestion = parseInt(num, 10) <= parseInt(nextNum, 10);
  const formIsComplete = lastQuestion === 'END';

  return isValid && (isNotFutureQuestion || formIsComplete);
};

export const branchOfService = key =>
  questionLabels['1_branchOfService'][key === 'marines' ? 'navy' : key];

export const board = (formValues, noDRB) => {
  if (!formValues) return null;

  const prevAppType =
    ['1', '4'].indexOf(formValues['10_prevApplicationType']) > -1;
  const noPrevApp = formValues['8_prevApplication'] === '2';
  const preAppDateBefore = formValues['9_prevApplicationYear'] === '1';
  const courtMartial = formValues['7_courtMartial'] === '1';
  const transgender = formValues['4_reason'] === '5';
  const intention = formValues['6_intention'] === '1';
  const dischargeYear = formValues['2_dischargeYear'];
  const dischargeMonth = formValues['3_dischargeMonth'] || 1;
  const oldDischarge =
    moment().diff(moment([dischargeYear, dischargeMonth]), 'years', true) >= 15;
  const failureToExhaust = formValues['11_failureToExhaust'] === '1';

  let boardObj = {
    name: 'Board for Correction of Naval Records (BCNR)',
    abbr: 'BCNR',
  };
  if (
    ['army', 'airForce', 'coastGuard'].indexOf(
      formValues['1_branchOfService'],
    ) > -1
  ) {
    boardObj = {
      name: 'Board for Correction of Military Records (BCMR)',
      abbr: 'BCMR',
    };
  }

  // short circuit condition for prior period of service response
  if (noDRB) {
    return boardObj;
  }

  if (noPrevApp || preAppDateBefore || prevAppType || failureToExhaust) {
    if (courtMartial || transgender || intention || oldDischarge) {
      return boardObj;
    }

    if (formValues['1_branchOfService'] === 'airForce') {
      return {
        name: 'Air Force Discharge Review Board (AFDRB)',
        abbr: 'AFDRB',
      };
    }

    return { name: 'Discharge Review Board (DRB)', abbr: 'DRB' };
  }

  return boardObj;
};

export const venueAddress = (formValues, noDRB) => {
  if (!formValues) return null;

  const boardData = board(formValues);

  if (
    !noDRB &&
    boardData &&
    (boardData.abbr === 'DRB' || boardData.abbr === 'AFDRB')
  ) {
    switch (formValues['1_branchOfService']) {
      case 'army':
        return (
          <p className="va-address-block">
            Army Review Boards Agency
            <br />
            251 18th Street South
            <br />
            Suite 385
            <br />
            Arlington, VA 22202-3531
            <br />
          </p>
        );
      case 'airForce':
        return (
          <p className="va-address-block">
            Air Force Discharge Review Board
            <br />
            SAF/MRBP (AFDRB)
            <br />
            3351 Celmers Lane
            <br />
            Joint Base Andrews, MD 20762-6435
            <br />
          </p>
        );
      case 'coastGuard':
        return (
          <p className="va-address-block">
            Commandant (CG-133)
            <br />
            Attn: Office of Military Personnel
            <br />
            US Coast Guard Stop 7907
            <br />
            2703 Martin Luther King, Jr. Ave., S.E.
            <br />
            Washington, DC 20593-7907
            <br />
          </p>
        );
      default:
        // Navy or Marines
        return (
          <p className="va-address-block">
            Secretary of the Navy Council of Review Boards
            <br />
            ATTN: Naval Discharge Review Board
            <br />
            720 Kennon Ave S.E., Suite 309
            <br />
            Washington Navy Yard, DC 20374-5023
            <br />
          </p>
        );
    }
  } else {
    switch (formValues['1_branchOfService']) {
      case 'army':
        return (
          <p className="va-address-block">
            Army Review Boards Agency
            <br />
            251 18th Street South
            <br />
            Suite 385
            <br />
            Arlington, VA 22202-3531
            <br />
          </p>
        );
      case 'airForce':
        return (
          <p className="va-address-block">
            Air Force Board for Correction of Military Records
            <br />
            3351 Celmers Lane
            <br />
            Joint Base Andrews, MD 20762-6435
            <br />
          </p>
        );
      case 'coastGuard':
        return (
          <p className="va-address-block">
            DHS Office of the General Counsel
            <br />
            Board for Correction of Military Records, Stop 0485
            <br />
            2707 Martin Luther King Jr. Ave., SE
            <br />
            Washington, DC 20528
            <br />
          </p>
        );
      default:
        // Navy or Marines
        return (
          <p className="va-address-block">
            Board for Correction of Naval Records (BCNR)
            <br />
            701 S. Courthouse Road, Suite 1001
            <br />
            Arlington, VA 22204-2490
            <br />
          </p>
        );
    }
  }
};

export const formData = formValues => {
  const boardData = board(formValues);
  if (['DRB', 'AFDRB'].includes(boardData?.abbr)) {
    return {
      num: 293,
      link:
        'http://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0293.pdf',
    };
  }
  return {
    num: 149,
    link: 'https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0149.pdf',
  };
};

export const answerReview = (key, formValues) => {
  const ans = formValues[key];
  const dischargeYearLabel = prevApplicationYearCutoff[formValues['4_reason']];
  const monthObj = options.months.find(
    m => String(m.value) === formValues['3_dischargeMonth'],
  );
  const dischargeMonth = monthObj && monthObj.label;

  switch (key) {
    case '4_reason':
      return questionLabels[key][ans];
    case '5_dischargeType':
      return questionLabels[key][ans];
    case '6_intention':
      return questionLabels[key][ans];
    case '2_dischargeYear':
      if (ans === '1991' && !formValues['3_dischargeMonth']) {
        return 'I was discharged before 1992';
      }
      return `I was discharged in ${dischargeMonth || ''} ${formValues[key]}`;
    case '7_courtMartial':
      return questionLabels[key][ans];
    case '1_branchOfService':
      return `I served in the ${questionLabels[key][ans]}`;
    case '8_prevApplication':
      return questionLabels[key][ans];
    case '9_prevApplicationYear':
      return `I made my previous application ${
        ans === '1'
          ? `${dischargeYearLabel} or earlier`
          : `after ${dischargeYearLabel}`
      }`;
    case '10_prevApplicationType':
      if (ans === '3') {
        if (['navy', 'marines'].includes(formValues['1_branchOfService'])) {
          return 'I applied to the Board for Correction of Naval Records (BCNR).';
        }
        return 'I applied to a Board for Correction of Military Records (BCMR).';
      }
      return questionLabels[key][ans];
    default:
      return questionLabels[key][ans];
  }
};

export const deriveIsAirForceAFRBAPortal = formValues =>
  formValues['1_branchOfService'] === 'airForce' &&
  board(formValues).abbr === 'BCMR' &&
  formData(formValues).num === 149;

// v2 Helpers

// Changes Marine Corps discharge board to Navy for naming on results pages
// since the Marine Corps does not have a discharge board.
export const determineBranchOfService = key =>
  key === RESPONSES.MARINE_CORPS ? RESPONSES.NAVY : key;

// Determines if a previous discharge occurred more than 15 years ago.
export const determineOldDischarge = (dischargeYear, dischargeMonth) =>
  differenceInYears(new Date(), new Date(dischargeMonth, dischargeYear)) >= 15;

// Determines the label used on the review page to provide a full readable answer based on answers in the form.
export const answerReviewLabel = (key, formValues) => {
  const answer = formValues[key];
  const monthObj = options.months.find(
    m => String(m.value) === formValues[SHORT_NAME_MAP.DISCHARGE_MONTH],
  );

  const dischargeMonth = (monthObj && monthObj.label) || '';

  switch (key) {
    case SHORT_NAME_MAP.SERVICE_BRANCH:
      return `I served in the ${formValues[key]}.`;
    case SHORT_NAME_MAP.DISCHARGE_YEAR:
      if (
        answer === 'Before 1992' &&
        !formValues[SHORT_NAME_MAP.DISCHARGE_MONTH]
      ) {
        return 'I was discharged before 1992.';
      }

      return `I was discharged in ${dischargeMonth} ${formValues[key]}.`;
    case SHORT_NAME_MAP.PREV_APPLICATION:
      if (answer === RESPONSES.YES) {
        return 'I have previously applied for a discharge upgrade for this period of service.';
      }

      return 'I have not previously applied for a discharge upgrade for this period of service.';
    case SHORT_NAME_MAP.PREV_APPLICATION_YEAR:
      // The .toLowerCase() corrects the casing of "After {year}" as it is
      // at the end of the sentence
      return `I made my previous application ${answer.toLowerCase()}.`;
    case SHORT_NAME_MAP.COURT_MARTIAL:
      if (answer === RESPONSES.NOT_SURE) {
        return `I'm not sure if my discharge was the outcome of a general court-martial.`;
      }

      return answer;
    case SHORT_NAME_MAP.PREV_APPLICATION_TYPE:
      if (answer === RESPONSES.NOT_SURE) {
        return `I'm not sure what kind of discharge upgrade application I previously made.`;
      }

      return answer;
    default: {
      // With the question response map having all unique answers we only need to account for the questions that do not provide enough information.
      return answer;
    }
  }
};

// Determines board specific data based on form responses and returns an obj that is used on results pages.
export const determineBoardObj = (formResponses, noDRB) => {
  if (!formResponses) {
    return null;
  }

  const prevAppType = [
    RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY,
    RESPONSES.NOT_SURE,
  ].includes(formResponses[SHORT_NAME_MAP.PREV_APPLICATION_TYPE]);

  const noPrevApp =
    formResponses[SHORT_NAME_MAP.PREV_APPLICATION] === RESPONSES.NO;

  const preAppDateBefore = [
    RESPONSES.PREV_APPLICATION_BEFORE_2014,
    RESPONSES.PREV_APPLICATION_BEFORE_2011,
    RESPONSES.PREV_APPLICATION_BEFORE_2017,
  ].includes(formResponses[SHORT_NAME_MAP.PREV_APPLICATION_YEAR]);

  const courtMartial =
    formResponses[SHORT_NAME_MAP.COURT_MARTIAL] === RESPONSES.COURT_MARTIAL_YES;

  const transgender =
    formResponses[SHORT_NAME_MAP.REASON] === RESPONSES.REASON_TRANSGENDER;
  const intention =
    formResponses[SHORT_NAME_MAP.INTENTION] === RESPONSES.INTENTION_YES;
  const dischargeYear = formResponses[SHORT_NAME_MAP.DISCHARGE_YEAR];
  const dischargeMonth = formResponses[SHORT_NAME_MAP.DISCHARGE_MONTH] || 0;

  const oldDischarge = determineOldDischarge(dischargeMonth, dischargeYear);

  const failureToExhaust = [
    RESPONSES.FAILURE_TO_EXHAUST_1A,
    RESPONSES.FAILURE_TO_EXHAUST_1B,
  ].includes(formResponses[SHORT_NAME_MAP.FAILURE_TO_EXHAUST]);

  let boardObj = {
    name: 'Board for Correction of Naval Records (BCNR)',
    abbr: BCNR,
  };
  if (
    [RESPONSES.ARMY, RESPONSES.AIR_FORCE, RESPONSES.COAST_GUARD].includes(
      formResponses[SHORT_NAME_MAP.SERVICE_BRANCH],
    )
  ) {
    boardObj = {
      name: 'Board for Correction of Military Records (BCMR)',
      abbr: BCMR,
    };
  }

  if (noDRB) {
    return boardObj;
  }

  if (noPrevApp || preAppDateBefore || prevAppType || failureToExhaust) {
    if (courtMartial || transgender || intention || oldDischarge) {
      return boardObj;
    }

    if (formResponses[SHORT_NAME_MAP.SERVICE_BRANCH] === RESPONSES.AIR_FORCE) {
      return {
        name: 'Air Force Discharge Review Board (AFDRB)',
        abbr: AFDRB,
      };
    }

    return { name: 'Discharge Review Board (DRB)', abbr: DRB };
  }

  return boardObj;
};

// Determines specific form data Veterans will need to fill out based on form responses.
export const determineFormData = formResponses => {
  const boardData = determineBoardObj(formResponses);
  if ([DRB, AFDRB].includes(boardData?.abbr)) {
    return {
      num: 293,
      link:
        'http://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0293.pdf',
    };
  }
  return {
    num: 149,
    link: 'https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0149.pdf',
  };
};

// Determines if we should use AFRBA Portal and Link.
export const determineAirForceAFRBAPortal = formResponses =>
  formResponses[SHORT_NAME_MAP.SERVICE_BRANCH] === RESPONSES.AIR_FORCE &&
  determineBoardObj(formResponses).abbr === BCMR &&
  determineFormData(formResponses).num === 149;
