import React from 'react';
import { BCMR, BCNR, DRB, AFDRB, monthLabelMap } from '../constants';
import { SHORT_NAME_MAP, RESPONSES } from '../constants/question-data-map';

// Changes Marine Corps discharge board to Navy for naming on results pages
// since the Marine Corps does not have a discharge board.
export const determineBranchOfService = key =>
  key === RESPONSES.MARINE_CORPS ? RESPONSES.NAVY : key;

// Determines if a previous discharge occurred more than 15 years ago.
export const determineOldDischarge = (dischargeYear, dischargeMonth) =>
  new Date() >= new Date(Number(dischargeYear) + 15, dischargeMonth);

// Determines the label used on the review page to provide a full readable answer based on answers in the form.
export const answerReviewLabel = (key, formValues) => {
  const answer = formValues[key];

  const dischargeMonth =
    monthLabelMap[formValues[SHORT_NAME_MAP.DISCHARGE_MONTH]] || '';

  switch (key) {
    case SHORT_NAME_MAP.SERVICE_BRANCH:
      return `I served in the ${formValues[key]}.`;
    case SHORT_NAME_MAP.DISCHARGE_YEAR:
      return `I was discharged in ${formValues[key]}.`;
    case SHORT_NAME_MAP.DISCHARGE_MONTH:
      return dischargeMonth;
    case SHORT_NAME_MAP.PREV_APPLICATION:
      if (answer === RESPONSES.YES) {
        return 'I have previously applied for a discharge upgrade for this period of service.';
      }

      return 'I have not previously applied for a discharge upgrade for this period of service.';
    case SHORT_NAME_MAP.PREV_APPLICATION_YEAR:
      // The .toLowerCase() corrects the casing of "After {year}" as it is
      // at the end of the sentence
      return `I made my previous application ${answer?.toLowerCase()}.`;
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
  const dischargeMonth = formResponses[SHORT_NAME_MAP.DISCHARGE_MONTH] - 1 || 0;

  const oldDischarge = determineOldDischarge(dischargeYear, dischargeMonth);

  const failureToExhaust = [
    RESPONSES.FAILURE_TO_EXHAUST_BCMR_YES,
    RESPONSES.FAILURE_TO_EXHAUST_BCNR_YES,
  ].includes(formResponses[SHORT_NAME_MAP.FAILURE_TO_EXHAUST]);

  let boardObj = {
    name: 'Board for Correction of Naval Records (BCNR)',
    abbr: BCNR,
  };
  if (
    [
      RESPONSES.ARMY,
      RESPONSES.AIR_FORCE,
      RESPONSES.COAST_GUARD,
      RESPONSES.SPACE_FORCE,
    ].includes(formResponses[SHORT_NAME_MAP.SERVICE_BRANCH])
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

    if (
      [RESPONSES.AIR_FORCE, RESPONSES.SPACE_FORCE].includes(
        formResponses[SHORT_NAME_MAP.SERVICE_BRANCH],
      )
    ) {
      return {
        name: 'Air Force Discharge Review Board (AFDRB)',
        abbr: AFDRB,
      };
    }

    return { name: 'Discharge Review Board (DRB)', abbr: DRB };
  }

  return boardObj;
};

// Determines address for discharge paperwork
export const determineVenueAddress = (formResponses, noDRB) => {
  if (!formResponses) return null;

  const boardData = determineBoardObj(formResponses);

  if (
    !noDRB &&
    boardData &&
    (boardData.abbr === DRB || boardData.abbr === AFDRB)
  ) {
    switch (formResponses[SHORT_NAME_MAP.SERVICE_BRANCH]) {
      case RESPONSES.ARMY:
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
      case RESPONSES.AIR_FORCE:
      case RESPONSES.SPACE_FORCE:
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
      case RESPONSES.COAST_GUARD:
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
    switch (formResponses[SHORT_NAME_MAP.SERVICE_BRANCH]) {
      case RESPONSES.ARMY:
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
      case RESPONSES.AIR_FORCE:
      case RESPONSES.SPACE_FORCE:
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
      case RESPONSES.COAST_GUARD:
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

// Determines specific form data Veterans will need to fill out based on form responses.
export const determineFormData = formResponses => {
  const boardData = determineBoardObj(formResponses);

  if ([DRB, AFDRB].includes(boardData?.abbr)) {
    return {
      num: 293,
      formDescription:
        'the Review of Discharge From the Armed Forces of the United States (DOD Form 293)',
      link:
        'http://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0293.pdf',
    };
  }

  return {
    num: 149,
    formDescription:
      'Correction of Military Record Under the Provisions of Title 10, U.S. Code, Section 1552 (DD Form 149)',
    link: 'https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0149.pdf',
  };
};

// Determines if we should use AFRBA Portal and Link.
export const determineAirForceAFRBAPortal = formResponses =>
  [RESPONSES.AIR_FORCE, RESPONSES.SPACE_FORCE].includes(
    formResponses[SHORT_NAME_MAP.SERVICE_BRANCH],
  ) &&
  determineBoardObj(formResponses).abbr === BCMR &&
  determineFormData(formResponses).num === 149;

export const handleDD215Update = (boardToSubmit, prevAppType, oldDischarge) => {
  if (
    ![
      RESPONSES.PREV_APPLICATION_BCMR,
      RESPONSES.PREV_APPLICATION_BCNR,
    ].includes(prevAppType)
  ) {
    return oldDischarge
      ? `the ${
          boardToSubmit.name
        }. The Board handles all cases from 15 or more years ago.`
      : 'the Discharge Review Board (DRB). The DRB was the Board that granted your previous upgrade request, so you must apply to them for a new DD214.';
  }
  if (
    [RESPONSES.PREV_APPLICATION_BCMR, RESPONSES.PREV_APPLICATION_BCNR].includes(
      prevAppType,
    )
  ) {
    return `the ${boardToSubmit.name}. The ${
      boardToSubmit.abbr
    } was the Board that granted your previous upgrade request, so you must apply to them for a new DD214.`;
  }
  return '';
};

export const isPreviousApplicationYear = prevAppYear => {
  return [
    RESPONSES.PREV_APPLICATION_BEFORE_2011,
    RESPONSES.PREV_APPLICATION_BEFORE_2014,
    RESPONSES.PREV_APPLICATION_BEFORE_2017,
  ].includes(prevAppYear);
};

export const shouldReapplyToBoard = (prevAppType, formResponses) => {
  return (
    [RESPONSES.PREV_APPLICATION_BCMR, RESPONSES.PREV_APPLICATION_BCNR].includes(
      prevAppType,
    ) &&
    [
      RESPONSES.FAILURE_TO_EXHAUST_BCMR_YES,
      RESPONSES.FAILURE_TO_EXHAUST_BCNR_YES,
    ].includes(formResponses[SHORT_NAME_MAP.FAILURE_TO_EXHAUST])
  );
};

export const isDocumentaryOrNotSure = prevAppType => {
  return [
    RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY,
    RESPONSES.NOT_SURE,
  ].includes(prevAppType);
};

export const handleDRBExplanation = (
  boardToSubmit,
  serviceBranch,
  prevAppType,
) => {
  const boardName =
    boardToSubmit.abbr === DRB
      ? 'Discharge Review Board (DRB)'
      : 'Air Force Discharge Review Board (AFDRB)';

  return `the ${boardName} for the ${serviceBranch}. The ${
    boardToSubmit.abbr
  } is a panel of commissioned officers, or a combination of senior non-commissioned officers (NCOs) and officers. The deadline to apply to the ${
    boardToSubmit.abbr
  } is 15 years after your date of discharge; after this time period, you must apply to a different board. ${
    prevAppType === RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY
      ? `Because your application was rejected by the ${
          boardToSubmit.abbr
        } on Documentary Review, you must apply for a Personal Appearance Review.`
      : ''
  }`;
};

export const getBoardExplanation = formResponses => {
  const reason = formResponses[SHORT_NAME_MAP.REASON];
  const noPrevApp =
    formResponses[SHORT_NAME_MAP.PREV_APPLICATION] === RESPONSES.NO;
  const prevAppType = formResponses[SHORT_NAME_MAP.PREV_APPLICATION_TYPE];
  const prevAppYear = formResponses[SHORT_NAME_MAP.PREV_APPLICATION_YEAR];
  const dischargeYear = formResponses[SHORT_NAME_MAP.DISCHARGE_YEAR];
  const dischargeMonth = formResponses[SHORT_NAME_MAP.DISCHARGE_MONTH] - 1 || 0;
  const oldDischarge = determineOldDischarge(dischargeYear, dischargeMonth);

  const boardToSubmit = determineBoardObj(formResponses);
  const serviceBranch = determineBranchOfService(
    formResponses[SHORT_NAME_MAP.SERVICE_BRANCH],
  );

  const { abbr, name } = boardToSubmit;

  if (reason === RESPONSES.REASON_DD215_UPDATE_TO_DD214) {
    return handleDD215Update(boardToSubmit, prevAppType, oldDischarge);
  }

  if (isPreviousApplicationYear(prevAppYear) && abbr === DRB) {
    return `the Discharge Review Board (DRB) for the ${serviceBranch}. In general, the DRB does not handle appeals for previously denied applications. However, because new rules have recently come out regarding discharges like yours, the Boards may treat your application as a new case. If possible, review the new policies and state in your application how the change in the policy is relevant to your case. If the DRB decides that the new rules don’t apply to your situation, you will likely have to send an appeal to a different Board.`;
  }

  if (formResponses[SHORT_NAME_MAP.FAILURE_TO_EXHAUST] && abbr === DRB) {
    return `the Discharge Review Board (DRB) for the ${serviceBranch}. The ${name} previously rejected your application because you did not apply to the DRB first. For applications like yours, the ${abbr} can review only cases that have already been rejected by the DRB. The DRB is a panel of commissioned officers, or a mix of senior non-commissioned officers (NCOs) and officers. The deadline to apply to the DRB is 15 years after your date of discharge. After this time period, you must apply to a different board. 
    ${
      prevAppType === RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY
        ? `Because your application was rejected by the ${abbr} on Documentary Review, you must apply for a Personal Appearance Review.`
        : ''
    }`;
  }

  if (prevAppType === RESPONSES.PREV_APPLICATION_DRB_PERSONAL) {
    return `the ${abbr} for the ${serviceBranch} to appeal that decision. This is because your application was denied by the Discharge Review Board (DRB) on a Personal Appearance Review.`;
  }

  if (shouldReapplyToBoard(prevAppType, formResponses)) {
    return `the ${abbr}. If you’ve applied before, you must re-apply to the ${abbr} for reconsideration.`;
  }

  if (
    (noPrevApp ||
      isDocumentaryOrNotSure(prevAppType) ||
      isPreviousApplicationYear(prevAppYear)) &&
    oldDischarge
  ) {
    return `the ${abbr} for the ${serviceBranch}. This is because the Board handles all cases from 15 or more years ago.`;
  }

  if (
    formResponses[SHORT_NAME_MAP.COURT_MARTIAL] === RESPONSES.COURT_MARTIAL_YES
  ) {
    return `the ${abbr} for the ${serviceBranch}. This is because your discharge was the result of a general court-martial.`;
  }

  if (
    reason === RESPONSES.REASON_TRANSGENDER ||
    formResponses[SHORT_NAME_MAP.INTENTION] === RESPONSES.INTENTION_YES
  ) {
    return `the ${abbr} for the ${serviceBranch}. This is because you want to change information other than your characterization of discharge, re-enlistment code, separation code, and narrative reason for discharge.`;
  }

  if (abbr === DRB || abbr === AFDRB) {
    return handleDRBExplanation(boardToSubmit, serviceBranch, prevAppType);
  }

  return '';
};

export const renderMedicalRecordInfo = formResponses => {
  const reason = formResponses[SHORT_NAME_MAP.REASON];
  if (
    [
      RESPONSES.REASON_PTSD,
      RESPONSES.REASON_TBI,
      RESPONSES.REASON_SEXUAL_ASSAULT,
    ].indexOf(reason) > -1
  ) {
    let requestQuestion;
    if (parseInt(formResponses[SHORT_NAME_MAP.DISCHARGE_YEAR], 10) >= 1992) {
      requestQuestion = (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.archives.gov/st-louis/military-personnel/ompf-background.html"
        >
          Find out how to request your military medical records (opens in a new
          tab).
        </a>
      );
    } else {
      requestQuestion = (
        <span>
          Your <strong>military medical records</strong> will be included with
          the VA medical records you request.
        </span>
      );
    }

    let providerStatement;
    if (reason === RESPONSES.REASON_PTSD) {
      providerStatement = (
        <li>
          If you’ve seen a non-VA health care provider for diagnosis or
          treatment of PTSD or another mental health condition, you should also
          submit private medical treatment records that can provide information
          about your condition. You’ll need to contact your provider to request
          copies of your records.
        </li>
      );
    }
    if (reason === RESPONSES.REASON_TBI) {
      providerStatement = (
        <li>
          If you’ve seen a non-VA health care provider for diagnosis or
          treatment of TBI, you should also submit private medical treatment
          records that can provide information about your condition. You’ll need
          to contact your provider to request copies of your records.
        </li>
      );
    }
    if (reason === RESPONSES.REASON_SEXUAL_ASSAULT) {
      providerStatement = (
        <li>
          If you’ve seen a non-VA health care provider for for treatment after
          your assault or harassment, you should also submit records from a
          non-VA health care provider. You’ll need to contact your provider to
          request copies of your records.
        </li>
      );
    }

    return (
      <li>
        <h3>Medical records</h3>
        <ul>
          <li>You’ll need to submit copies of your medical records.</li>
          <li>
            If you need to request copies of your VA medical records, fill out
            and submit a Request for and Authorization to Release Health
            Information (VA Form 10-5345) to your local VA medical center.
          </li>
          <li>
            {requestQuestion}
            <br />
            <a
              href="https://www.va.gov/find-forms/about-form-10-5345/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get VA Form 10-5345 to download (opens in a new tab)
            </a>
          </li>

          {providerStatement}
        </ul>
      </li>
    );
  }
  return null;
};

export const determineBoardName = branch => {
  let boardName;

  switch (branch) {
    case RESPONSES.AIR_FORCE:
    case RESPONSES.SPACE_FORCE:
      boardName = 'Air Force Board for Correction of Military Records';
      break;
    case RESPONSES.ARMY:
    case RESPONSES.COAST_GUARD:
      boardName = 'Board for Correction of Military Records (BCMR)';
      break;
    case RESPONSES.NAVY:
    case RESPONSES.MARINE_CORPS:
      boardName = 'Board for Correction of Naval Records (BCNR)';
      break;
    default:
      boardName = '';
      break;
  }
  return boardName;
};
