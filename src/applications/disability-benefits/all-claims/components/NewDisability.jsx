import React from 'react';
import { capitalizeEachWord } from '../utils';
import { NULL_CONDITION_STRING } from '../constants';
import { showRevisedNewDisabilitiesPage } from '../content/addDisabilities';

export default function NewDisability({ formData }) {
  if (showRevisedNewDisabilitiesPage()) {
    return (
      <div className="vads-u-flex--fill vads-u-padding-right--2 word-break capitalize-first-letter">
        {typeof formData?.condition === 'string'
          ? formData.condition
          : NULL_CONDITION_STRING}
      </div>
    );
  }
  return (
    <div className="vads-u-flex--fill vads-u-padding-right--2 word-break">
      {typeof formData?.condition === 'string'
        ? capitalizeEachWord(formData.condition)
        : NULL_CONDITION_STRING}
    </div>
  );
}
