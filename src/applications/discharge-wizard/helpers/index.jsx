import React from 'react';
import moment from 'moment';
import { questionLabels, prevApplicationYearCutoff } from '../constants';
import * as options from 'platform/static-data/options-for-select';

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
    return { name: 'Discharge Review Board (DRB)', abbr: 'DRB' };
  }

  return boardObj;
};

export const venueAddress = (formValues, noDRB) => {
  if (!formValues) return null;

  const boardData = board(formValues);
  if (!noDRB && boardData && boardData.abbr === 'DRB') {
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
            Air Force Review Boards Agency
            <br />
            SAF/MRBR
            <br />
            550-C Street West, Suite 40
            <br />
            Randolph AFB, TX 78150-4742
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
            SAF/MRBR
            <br />
            3351 Celmers Lane
            <br />
            Joint Base Andrews NAF Washington 20762-6604
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
  if (boardData?.abbr === 'DRB') {
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
