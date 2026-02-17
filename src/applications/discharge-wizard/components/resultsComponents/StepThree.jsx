import React from 'react';
import PropTypes from 'prop-types';

import { SHORT_NAME_MAP, RESPONSES } from '../../constants/question-data-map';
import { BCNR, BCMR, DRB, AFDRB } from '../../constants';
import {
  determineBoardName,
  determineBoardObj,
  determineFormData,
  determineVenueAddress,
  isPreviousApplicationYear,
} from '../../helpers';

const StepThree = ({ formResponses }) => {
  let onlineSubmissionMsg;
  const boardToSubmit = determineBoardObj(formResponses);
  const boardName = determineBoardName(formResponses.SERVICE_BRANCH);

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

  const { num: formNumber } = determineFormData(formResponses);

  const applicationTitle =
    formNumber === 149
      ? 'Application for Correction of Military Record (DD 149)'
      : 'Application for the Review of Discharge From the Armed Forces of the United States (DOD Form 293)';

  return (
    <va-process-list-item header={headerText} level="2">
      {formResponses.SERVICE_BRANCH === RESPONSES.AIR_FORCE ||
      formResponses.SERVICE_BRANCH === RESPONSES.SPACE_FORCE ? (
        <p>
          Based on your answers, you need to complete an {applicationTitle}. You
          can download this form from the Air Force Review Boards Agency Website
          and Portal.
        </p>
      ) : (
        ''
      )}
      <p>
        There are a number of different boards that handle discharge upgrades
        and corrections. Based on your answers on the previous page, you need to
        apply to the {boardName}.
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
              Your last application was made before the release of DOD guidance
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
      <va-button
        data-testid="duw-print"
        onClick={handlePrint}
        text="Print this page"
      />
    </va-process-list-item>
  );
};

StepThree.propTypes = {
  formResponses: PropTypes.object.isRequired,
};

export default StepThree;
