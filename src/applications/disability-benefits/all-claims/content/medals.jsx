import React from 'react';

import { getPtsdClassification } from './ptsdClassification';

export const MedalsDescription = ({ formData, index }) => {
  const { incidentText } = getPtsdClassification(formData, '781');
  const isFirstIncident = index === 0;
  return (
    <div>
      <h5>Medals or Citations</h5>
      {isFirstIncident && (
        <p>
          Now we‘ll ask about the event that caused your {incidentText}. If
          there is more than one event or situation related to your PTSD, we‘ll
          ask questions about each one separately.
        </p>
      )}
      <p>
        Did you receive a medal or citation for the{' '}
        {isFirstIncident && `first `} event?
      </p>
    </div>
  );
};
