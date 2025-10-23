import React from 'react';
import PropTypes from 'prop-types';

const MedicationTerms = props => {
  const { avs } = props;

  if (!avs.pharmacyTerms?.length) {
    return null;
  }

  return (
    <va-additional-info trigger="What do these medication terms mean?" uswds>
      {avs.pharmacyTerms.map((term, idx) => (
        <div key={`term-${idx}`}>
          <h4>
            {term.term} {!!term.aka && term.aka}
          </h4>
          <p>
            {term.explanation} {!!term.patientActions && term.patientActions}
          </p>
        </div>
      ))}
    </va-additional-info>
  );
};

MedicationTerms.propTypes = {
  avs: PropTypes.object,
};

export default MedicationTerms;
