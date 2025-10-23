import React from 'react';

export default function VetTecProgramView({ formData }) {
  return (
    <div>
      <h4>{formData.programName}</h4>
      <p>Start: {formData.plannedStartDate}</p>
    </div>
  );
}
