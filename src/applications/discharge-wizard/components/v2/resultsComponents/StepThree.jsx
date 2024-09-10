import React from 'react';
import PropTypes from 'prop-types';

import {
  SHORT_NAME_MAP,
  RESPONSES,
} from '../../../constants/question-data-map';
import { BCNR, BCMR, DRB, AFDRB } from '../../../constants';
import {
  determineBoardObj,
  determineBranchOfService,
  venueAddress,
} from '../../../helpers';

const StepThree = ({ formResponses }) => {
  const reason = formResponses[SHORT_NAME_MAP.REASON];
  const noPrevApp =
    formResponses[SHORT_NAME_MAP.PREV_APPLICATION] === RESPONSES.NO;
  const prevAppType = formResponses[SHORT_NAME_MAP.PREV_APPLICATION_TYPE];
  const prevAppYear = formResponses[SHORT_NAME_MAP.PREV_APPLICATION_YEAR];
  const dischargeYear = formResponses[SHORT_NAME_MAP.DISCHARGE_YEAR];
  const dischargeMonth = formResponses[SHORT_NAME_MAP.DISCHARGE_MONTH] || 1;
  const oldDischarge =
    new Date().getFullYear() - new Date(dischargeYear, dischargeMonth) > 15;

  const boardToSubmit = determineBoardObj(formResponses);
  const branchOfService = determineBranchOfService(
    formResponses[SHORT_NAME_MAP.SERVICE_BRANCH],
  );

  let boardExplanation;
  let onlineSubmissionMsg;

  if (reason === RESPONSES.REASON_DD215_UPDATE_TO_DD214) {
    if (
      ![
        RESPONSES.PREV_APPLICATION_BCMR,
        RESPONSES.PREV_APPLICATION_BCNR,
      ].includes(prevAppType)
    ) {
      boardExplanation =
        'the Discharge Review Board (DRB). The DRB was the Board that granted your previous upgrade request, so you must apply to them for a new DD214.';
      if (oldDischarge) {
        boardExplanation = `the ${
          boardToSubmit.name
        }. The Board handles all cases from 15 or more years ago.`;
      }
    } else if (
      [
        RESPONSES.PREV_APPLICATION_BCMR,
        RESPONSES.PREV_APPLICATION_BCNR,
      ].includes(prevAppType)
    ) {
      boardExplanation = `the ${boardToSubmit.name}. The ${
        boardToSubmit.abbr
      } was the Board that granted your previous upgrade request, so you must apply to them for a new DD214.`;
    }
  } else if (
    [
      RESPONSES.PREV_APPLICATION_BEFORE_2011,
      RESPONSES.PREV_APPLICATION_BEFORE_2014,
      RESPONSES.PREV_APPLICATION_BEFORE_2017,
    ].includes(prevAppYear) &&
    boardToSubmit.abbr === DRB
  ) {
    boardExplanation = `the Discharge Review Board (DRB) for the ${branchOfService}. In general, the DRB does not handle appeals for previously denied applications. However, because new rules have recently come out regarding discharges like yours, the Boards may treat your application as a new case. If possible, review the new policies and state in your application how the change in the policy is relevant to your case. If the DRB decides that the new rules don’t apply to your situation, you will likely have to send an appeal to a different Board.`;
  } else if (
    formResponses[SHORT_NAME_MAP.FAILURE_TO_EXHAUST] &&
    boardToSubmit.abbr === DRB
  ) {
    boardExplanation = `the Discharge Review Board (DRB) for the ${branchOfService}. The ${
      boardToSubmit.name
    } previously rejected your application because you did not apply to the DRB first. For applications like yours, the ${
      boardToSubmit.abbr
    } can review only cases that have already been rejected by the DRB. The DRB is a panel of commissioned officers, or a mix of senior non-commissioned officers (NCOs) and officers. The deadline to apply to the DRB is 15 years after your date of discharge. After this time period, you must apply to a different board.`;
  } else if (prevAppType === RESPONSES.PREV_APPLICATION_DRB_PERSONAL) {
    boardExplanation = `the ${
      boardToSubmit.abbr
    } for the ${branchOfService} to appeal that decision. This is because your application was denied by the Discharge Review Board (DRB) on a Personal Appearance Review.`;
  } else if (
    [RESPONSES.PREV_APPLICATION_BCMR, RESPONSES.PREV_APPLICATION_BCNR].includes(
      prevAppType,
    ) &&
    [
      RESPONSES.FAILURE_TO_EXHAUST_BCMR_YES,
      RESPONSES.FAILURE_TO_EXHAUST_BCNR_YES,
    ].includes(formResponses[SHORT_NAME_MAP.FAILURE_TO_EXHAUST])
  ) {
    boardExplanation = `the ${
      boardToSubmit.abbr
    }. This is because, if you’ve applied before, you must re-apply to the ${
      boardToSubmit.abbr
    } for reconsideration.`;
  } else if (
    (noPrevApp ||
      [RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY, RESPONSES.NOT_SURE].includes(
        prevAppType,
      ) ||
      [
        RESPONSES.PREV_APPLICATION_BEFORE_2011,
        RESPONSES.PREV_APPLICATION_BEFORE_2014,
        RESPONSES.PREV_APPLICATION_BEFORE_2017,
      ].includes(prevAppYear)) &&
    oldDischarge
  ) {
    boardExplanation = `the ${
      boardToSubmit.abbr
    } for the ${branchOfService}. This is because the Board handles all cases from 15 or more years ago.`;
  } else if (
    formResponses[SHORT_NAME_MAP.COURT_MARTIAL] === RESPONSES.COURT_MARTIAL_YES
  ) {
    boardExplanation = `the ${
      boardToSubmit.abbr
    } for the ${branchOfService}. This is because your discharge was the result of a general court-martial.`;
  } else if (
    reason === RESPONSES.REASON_TRANSGENDER ||
    formResponses[SHORT_NAME_MAP.INTENTION] === RESPONSES.INTENTION_YES
  ) {
    boardExplanation = `the ${
      boardToSubmit.abbr
    } for the ${branchOfService}. This is because you want to change information other than your characterization of discharge, re-enlistment code, separation code, and narrative reason for discharge.`;
  } else if (boardToSubmit.abbr === DRB || boardToSubmit.abbr === AFDRB) {
    const boardName =
      boardToSubmit.abbr === DRB
        ? 'Discharge Review Board (DRB)'
        : 'Air Force Discharge Review Board (AFDRB)';

    boardExplanation = `the ${boardName} for the ${branchOfService}. The ${
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
  }

  if (
    boardToSubmit.abbr === DRB &&
    formResponses[SHORT_NAME_MAP.SERVICE_BRANCH] === RESPONSES.ARMY
  ) {
    onlineSubmissionMsg = (
      <p>
        You can also submit this information online at ACTSOnline.{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://actsonline.army.mil/"
        >
          Visit ACTSOnline to submit your information (opens in a new tab)
        </a>
        .
      </p>
    );
  } else {
    onlineSubmissionMsg = (
      <p>At this time, there isn’t a way to submit this form online.</p>
    );
  }

  const handlePrint = () => {
    if (window.print) {
      window.print();
    }
  };

  const headerText =
    boardToSubmit.abbr === AFDRB
      ? 'Submit your completed application form and all supporting documents online or by mail'
      : 'Mail your completed form and all supporting materials';

  return (
    <va-process-list-item header={headerText}>
      <p>
        There are a number of different boards that handle discharge upgrades
        and corrections. Based on your answers on the previous page, you need to
        apply to {boardExplanation}
      </p>
      {boardToSubmit.abbr === 'AFDRB' ? (
        <>
          <p>
            You can submit your completed application form and all supporting
            documents through the Air Force Discharge Review Board website. The
            online application portal allows the Board’s intake staff to
            securely work with your digital application and build your case file
            more quickly and efficiently than with a hardcopy application.
          </p>
          <a
            className="vads-u-margin-top--3 vads-u-display--block"
            href="https://afrba-portal.cce.af.mil/#application-submission-drb"
            target="_blank"
            rel="noopener noreferrer"
          >
            Submit your application online (opens in a new tab)
          </a>
          <p>
            If you cannot access the website, you may mail your completed form
            and all supporting documents to the AFDRB to:
          </p>
          {venueAddress(formResponses)}
        </>
      ) : (
        <>
          {[
            RESPONSES.PREV_APPLICATION_BEFORE_2011,
            RESPONSES.PREV_APPLICATION_BEFORE_2014,
            RESPONSES.PREV_APPLICATION_BEFORE_2017,
          ].includes(prevAppYear) &&
          [BCNR, BCMR].includes(determineBoardObj(formResponses).abbr) ? (
            <p>
              Your last application was made before the release of DoD guidance
              related to discharges like yours. As a result, the Board may treat
              your application as a new case. If possible, review the new
              policies and state in your application how the change in policy is
              relevant to your case.
            </p>
          ) : null}
          <p>
            Mail your completed form and all supporting documents to the{' '}
            {boardToSubmit.abbr} at:
          </p>
          {venueAddress(formResponses)}
          {onlineSubmissionMsg}
        </>
      )}
      <va-button onClick={handlePrint} text="Print this page" />
    </va-process-list-item>
  );
};

StepThree.propTypes = {
  formResponses: PropTypes.object.isRequired,
};

export default StepThree;
