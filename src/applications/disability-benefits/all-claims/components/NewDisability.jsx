import React from 'react';
import { NULL_CONDITION_STRING } from '../constants';

export default function NewDisability({ formData }) {
  return (
    <div className="vads-u-flex--fill vads-u-padding-right--2 word-break capitalize-first-letter">
      {typeof formData?.condition === 'string'
        ? formData.condition
        : NULL_CONDITION_STRING}
    </div>
  );
}
