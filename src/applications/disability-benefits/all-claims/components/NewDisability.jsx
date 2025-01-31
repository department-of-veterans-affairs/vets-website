import React from 'react';
import PropTypes from 'prop-types';

import { NULL_CONDITION_STRING } from '../constants';

export default function NewDisability({ formData }) {
  return (
    // TODO https://github.com/department-of-veterans-affairs/vagov-claim-classification/issues/671:
    // When remove allClaimsAddDisabilitiesEnhancement FF, remove the vads-u-flex--fill class
    <div className="vads-u-margin-left--1 vads-u-flex--fill vads-u-padding-right--2 word-break capitalize-first-letter">
      {typeof formData?.condition === 'string'
        ? formData.condition
        : NULL_CONDITION_STRING}
    </div>
  );
}

NewDisability.propTypes = {
  formData: PropTypes.object.isRequired,
};
