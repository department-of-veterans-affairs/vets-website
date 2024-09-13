import React from 'react';
import PropTypes from 'prop-types';

import {
  SHORT_NAME_MAP,
  RESPONSES,
} from '../../../constants/question-data-map';
import { BCNR, BCMR, DRB, AFDRB } from '../../../constants';
import {
  determineBoardObj,
  determineVenueAddress,
  stepHeaderLevel,
  getBoardExplanation,
  isPreviousApplicationYear,
} from '../../../helpers';

const StepThree = ({ formResponses }) => {
  let onlineSubmissionMsg;
  const boardToSubmit = determineBoardObj(formResponses);
  const boardExplanation = getBoardExplanation(formResponses);

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

  const level = stepHeaderLevel(formResponses);

  return (
    <va-process-list-item header={headerText} level={level}>
      <p>
        There are a number of different boards that handle discharge upgrades
        and corrections. Based on your answers on the previous page, you need to
        apply to {boardExplanation}
      </p>
      {boardToSubmit.abbr === AFDRB ? (
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
          {determineVenueAddress(formResponses)}
        </>
      ) : (
        <>
          {isPreviousApplicationYear(
            formResponses[SHORT_NAME_MAP.PREV_APPLICATION_YEAR],
          ) && [BCNR, BCMR].includes(boardToSubmit.abbr) ? (
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
          {determineVenueAddress(formResponses)}
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
