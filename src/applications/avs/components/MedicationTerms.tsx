import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import type { MedicationTermsProps } from '../types';

const MedicationTerms: React.FC<MedicationTermsProps> = ({ avs }) => {
  if (!avs.pharmacyTerms?.length) {
    return null;
  }

  return (
    <VaAdditionalInfo trigger="What do these medication terms mean?">
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
    </VaAdditionalInfo>
  );
};

export default MedicationTerms;
