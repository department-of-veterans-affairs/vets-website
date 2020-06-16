import React from 'react';
import { capitalizeEachWord } from '../utils';
import { NULL_CONDITION_STRING } from '../constants';

export default function NewDisability({ formData }) {
  return (
    <div className="vads-u-flex--fill">
      {typeof formData.condition === 'string'
        ? capitalizeEachWord(formData.condition)
        : NULL_CONDITION_STRING}
    </div>
  );
}
