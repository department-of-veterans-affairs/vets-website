// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Relative imports
import { board, branchOfService, venueAddress } from '../../helpers';

const StepThree = ({ formValues }) => {
  const reasonCode = formValues['4_reason'];
  const noPrevApp = formValues['8_prevApplication'] === '2';
  const prevAppType = formValues['10_prevApplicationType'];
  const prevAppYear = formValues['9_prevApplicationYear'];
  const dischargeYear = formValues['2_dischargeYear'];
  const dischargeMonth = formValues['3_dischargeMonth'] || 1;
  const oldDischarge =
    moment().diff(moment([dischargeYear, dischargeMonth]), 'years', true) > 15;

  const boardToSubmit = board(formValues);

  let boardExplanation;
  let onlineSubmissionMsg;

  if (reasonCode === '8' && prevAppType !== '3') {
    boardExplanation =
      'the Discharge Review Board (DRB). The DRB was the Board that granted your previous upgrade request, so you must apply to them for a new DD214.';
    if (oldDischarge) {
      boardExplanation = `the ${
        boardToSubmit.name
      }. The Board handles all cases from 15 or more years ago.`;
    }
  } else if (reasonCode === '8' && prevAppType === '3') {
    boardExplanation = `the ${boardToSubmit.name}. The ${
      boardToSubmit.abbr
    } was the Board that granted your previous upgrade request, so you must apply to them for a new DD214.`;
  } else if (prevAppYear === '1' && boardToSubmit.abbr === 'DRB') {
    boardExplanation = `the Discharge Review Board (DRB) for the ${
      formValues['1_branchOfService']
    }. In general, the DRB does not handle appeals for previously denied applications. However, because new rules have recently come out regarding discharges like yours, the Boards may treat your application as a new case. If possible, review the new policies and state in your application how the change in the policy is relevant to your case. If the DRB decides that the new rules don’t apply to your situation, you will likely have to send an appeal to a different Board.`;
  } else if (
    formValues['11_failureToExhaust'] &&
    boardToSubmit.abbr === 'DRB'
  ) {
    boardExplanation = `the Discharge Review Board (DRB) for the ${
      formValues['1_branchOfService']
    }. The ${
      boardToSubmit.name
    } previously rejected your application because you did not apply to the DRB first. For applications like yours, the ${
      boardToSubmit.abbr
    } can review only cases that have already been rejected by the DRB. The DRB is a panel of commissioned officers, or a mix of senior non-commissioned officers (NCOs) and officers. The deadline to apply to the DRB is 15 years after your date of discharge. After this time period, you must apply to a different board.`;
  } else if (prevAppType === '2') {
    boardExplanation = `the ${boardToSubmit.abbr} for the ${branchOfService(
      formValues['1_branchOfService'],
    )} to appeal that decision. This is because your application was denied by the Discharge Review Board (DRB) on a Personal Appearance Review.`;
  } else if (prevAppType === '3' && formValues['11_failureToExhaust'] !== '1') {
    boardExplanation = `the ${
      boardToSubmit.abbr
    }. This is because, if you’ve applied before, you must re-apply to the ${
      boardToSubmit.abbr
    } for reconsideration.`;
  } else if (
    (noPrevApp ||
      ['1', '4'].indexOf(prevAppType) > -1 ||
      prevAppYear === '1') &&
    oldDischarge
  ) {
    boardExplanation = `the ${boardToSubmit.abbr} for the ${branchOfService(
      formValues['1_branchOfService'],
    )}. This is because the Board handles all cases from 15 or more years ago.`;
  } else if (formValues['7_courtMartial'] === '1') {
    boardExplanation = `the ${boardToSubmit.abbr} for the ${branchOfService(
      formValues['1_branchOfService'],
    )}. This is because your discharge was the result of a general court-martial.`;
  } else if (reasonCode === '5' || formValues['6_intention'] === '1') {
    boardExplanation = `the ${boardToSubmit.abbr} for the ${branchOfService(
      formValues['1_branchOfService'],
    )}. This is because you want to change information other than your characterization of discharge, re-enlistment code, separation code, and narrative reason for discharge.`;
  } else if (boardToSubmit.abbr === 'DRB') {
    boardExplanation = `the Discharge Review Board (DRB) for the ${branchOfService(
      formValues['1_branchOfService'],
    )}. The DRB is a panel of commissioned officers, or a combination of senior non-commissioned officers (NCOs) and officers. The deadline to apply to the DRB is 15 years after your date of discharge; after this time period, you must apply to a different board. ${
      prevAppType === '1'
        ? 'Because your application was rejected by the DRB on Documentary Review, you must apply for a Personal Appearance Review.'
        : ''
    }`;
  }

  if (
    boardToSubmit.abbr === 'DRB' &&
    formValues['1_branchOfService'] === 'army'
  ) {
    onlineSubmissionMsg = (
      <p>
        You can also submit this information online at ACTSOnline.{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://actsonline.army.mil/"
        >
          Visit ACTSOnline to submit your information
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

  return (
    <va-process-list-item header="Mail your completed form and all supporting materials">
      <p>
        There are a number of different boards that handle discharge upgrades
        and corrections. Based on your answers on the previous page, you need to
        apply to {boardExplanation}
      </p>
      {prevAppYear === '1' &&
      ['BCNR', 'BCMR'].includes(board(formValues).abbr) ? (
        <p>
          Your last application was made before the release of DoD guidance
          related to discharges like yours. As a result, the Board may treat
          your application as a new case. If possible, review the new policies
          and state in your application how the change in policy is relevant to
          your case.
        </p>
      ) : null}
      <p>
        Mail your completed form and all supporting documents to the{' '}
        {boardToSubmit.abbr} at:
      </p>
      {venueAddress(formValues)}
      {onlineSubmissionMsg}
      <va-button onClick={handlePrint} text="Print this page" />
    </va-process-list-item>
  );
};

StepThree.propTypes = {
  formValues: PropTypes.object.isRequired,
};

export default StepThree;
