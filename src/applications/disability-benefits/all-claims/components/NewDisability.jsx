import React from 'react';
import { getNewDisabilityName } from '../utils';

export default function NewDisability({ formData }) {
  return (
    <div>
      {getNewDisabilityName(formData.diagnosticCode)}
    </div>
  );
}
