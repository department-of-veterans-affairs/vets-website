// Dependencies
import React from 'react';
import PropTypes from 'prop-types';

// Relative Imports
import {
  branchOfService,
  board,
  deriveIsAirForceAFRBAPortal,
  formData,
} from '../../helpers';

const ResultsSummary = ({ formValues }) => {
  const forReconsideration =
    formValues['10_prevApplicationType'] === '3' &&
    formValues['11_failureToExhaust'] !== '1';

  const airForceAFRBAPortal = deriveIsAirForceAFRBAPortal(formValues);

  let summary = `Based on your answers, you need to complete Department of Defense (DoD) Form ${
    formData(formValues).num
  } and send it to the ${board(formValues).name} for the ${branchOfService(
    formValues['1_branchOfService'],
  )}${forReconsideration ? ' for reconsideration' : ''}.`;

  if (airForceAFRBAPortal) {
    summary =
      'Based on your answers, you need to complete an Application for Correction of Military Record (DD 149). You can download this form from the Air Force Review Agency Portal.';
  }

  return (
    <section className="va-introtext">
      <p>{summary}</p>
    </section>
  );
};

ResultsSummary.propTypes = {
  formValues: PropTypes.object.isRequired,
};

export default ResultsSummary;
