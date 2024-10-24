import React from 'react';
import PropTypes from 'prop-types';
import { NULL_CONDITION_STRING } from '../constants';

const NewDisability = ({ formData }) => (
  <p className="vads-u-margin-y--1 vads-u-margin-x--1 word-break">
    {formData?.condition ? formData.condition : NULL_CONDITION_STRING}
  </p>
);

NewDisability.propTypes = {
  formData: PropTypes.shape({
    condition: PropTypes.string,
  }),
};

export default NewDisability;
