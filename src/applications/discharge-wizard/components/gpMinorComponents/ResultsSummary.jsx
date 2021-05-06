// Dependencies
import React from 'react';
import PropTypes from 'prop-types';

// Relative Imports
import { branchOfService, board, formData } from '../../helpers';

const ResultsSummary = ({ formValues }) => {
  const forReconsideration =
    formValues['10_prevApplicationType'] === '3' &&
    formValues['11_failureToExhaust'] !== '1';
  const summary = `Based on your answers, you need to complete Department of Defense (DoD) Form ${
    formData(formValues).num
  } and send it to the ${board(formValues).name} for the ${branchOfService(
    formValues['1_branchOfService'],
  )}${forReconsideration ? ' for reconsideration' : ''}`;

  return (
    <section className="va-introtext">
      <p>{summary}.</p>
    </section>
  );
};

ResultsSummary.propTypes = {
  formValues: PropTypes.object.isRequired,
};

export default ResultsSummary;
