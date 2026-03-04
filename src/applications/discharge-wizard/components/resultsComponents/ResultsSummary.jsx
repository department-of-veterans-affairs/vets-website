import React from 'react';
import PropTypes from 'prop-types';
import { determineAirForceAFRBAPortal, determineFormData } from '../../helpers';

const ResultsSummary = ({ formResponses }) => {
  const airForceAFRBAPortal = determineAirForceAFRBAPortal(formResponses);
  const formData = determineFormData(formResponses);

  let summary = '';

  if (airForceAFRBAPortal) {
    summary = `Correction of Military Record Under the Provisions of Title 10, U.S. Code, Section 1552 (DD Form 149). You can download this form from the Air Force Review Boards Agency Website and Portal.`;
  } else {
    summary = `${formData?.formDescription}`;
  }

  return (
    <section className="va-introtext">
      <p>
        Based on your answers, you should submit an Application for {summary}.
      </p>
    </section>
  );
};

ResultsSummary.propTypes = {
  formResponses: PropTypes.object.isRequired,
};

export default ResultsSummary;
