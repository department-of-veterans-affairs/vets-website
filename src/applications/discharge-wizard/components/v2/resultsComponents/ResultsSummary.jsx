import React from 'react';
import PropTypes from 'prop-types';
import {
  determineBoardObj,
  determineAirForceAFRBAPortal,
  determineFormData,
} from '../../../helpers';

import {
  SHORT_NAME_MAP,
  RESPONSES,
} from '../../../constants/question-data-map';

const ResultsSummary = ({ formResponses }) => {
  const forReconsideration =
    [
      RESPONSES.PREV_APPLICATION_TYPE_3A,
      RESPONSES.PREV_APPLICATION_TYPE_3B,
    ].includes(formResponses[SHORT_NAME_MAP.PREV_APPLICATION_TYPE]) &&
    ![
      RESPONSES.FAILURE_TO_EXHAUST_1A,
      RESPONSES.FAILURE_TO_EXHAUST_1B,
    ].includes(formResponses[SHORT_NAME_MAP.FAILURE_TO_EXHAUST]);

  const airForceAFRBAPortal = determineAirForceAFRBAPortal(formResponses);
  const formNumber = determineFormData(formResponses).num;
  const dischargeBoard = determineBoardObj(formResponses).name;
  const serviceBranch = formResponses[SHORT_NAME_MAP.SERVICE_BRANCH];
  const isReconsideration = forReconsideration ? ' for reconsideration' : '';

  let summary = `Based on your answers, you need to complete Department of Defense (DoD) Form ${formNumber} and send it to the ${dischargeBoard} for the ${serviceBranch} ${isReconsideration}.`;

  if (airForceAFRBAPortal) {
    summary =
      'Based on your answers, you need to complete an Application for Correction of Military Record (DD 149). You can download this form from the Air Force Review Boards Agency Website and Portal.';
  }

  return (
    <section className="va-introtext">
      <p>{summary}</p>
    </section>
  );
};

ResultsSummary.propTypes = {
  formResponses: PropTypes.object.isRequired,
};

export default ResultsSummary;
