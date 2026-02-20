import React from 'react';
import PropTypes from 'prop-types';
import {
  determineBoardObj,
  determineAirForceAFRBAPortal,
  determineFormData,
  determineBranchOfService,
} from '../../helpers';

import { SHORT_NAME_MAP, RESPONSES } from '../../constants/question-data-map';

const ResultsSummary = ({ formResponses }) => {
  const forReconsideration =
    [RESPONSES.PREV_APPLICATION_BCMR, RESPONSES.PREV_APPLICATION_BCNR].includes(
      formResponses[SHORT_NAME_MAP.PREV_APPLICATION_TYPE],
    ) &&
    ![
      RESPONSES.FAILURE_TO_EXHAUST_BCMR_YES,
      RESPONSES.FAILURE_TO_EXHAUST_BCNR_YES,
    ].includes(formResponses[SHORT_NAME_MAP.FAILURE_TO_EXHAUST]);

  const airForceAFRBAPortal = determineAirForceAFRBAPortal(formResponses);

  const formData = determineFormData(formResponses);
  const dischargeBoard = determineBoardObj(formResponses).name;
  const serviceBranch = formResponses[SHORT_NAME_MAP.SERVICE_BRANCH];
  const isReconsideration = forReconsideration ? ' for reconsideration' : '';
  const sendInstructions = `send it to the ${dischargeBoard} for the ${determineBranchOfService(
    serviceBranch,
  )}${isReconsideration}.`;

  let summary = '';

  if (airForceAFRBAPortal) {
    summary = `Correction of Military Record Under the Provisions of Title 10, U.S. Code, Section 1552 (DD Form 149). You can download this form from the Air Force Review Boards Agency Website and Portal.`;
  } else {
    summary = `${formData?.formDescription} and ${sendInstructions}`;
  }

  return (
    <section className="va-introtext">
      <p>
        Based on your answers, you should submit an Application for {summary}
      </p>
    </section>
  );
};

ResultsSummary.propTypes = {
  formResponses: PropTypes.object.isRequired,
};

export default ResultsSummary;
