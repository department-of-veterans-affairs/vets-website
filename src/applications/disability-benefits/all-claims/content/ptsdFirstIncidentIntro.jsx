import React from 'react';
import { getPtsdClassification } from './ptsdClassification';

export const ptsdFirstIncidentIntro = ({ formData }) => {
  const { incidentText } = getPtsdClassification(formData, '781');
  return (
    <p>
      On the next few screens, we’ll ask about the first event that caused your
      {` ${incidentText}`} PTSD. If there is more than one event related to your
      PTSD, we’ll ask questions about each one separately.
    </p>
  );
};
