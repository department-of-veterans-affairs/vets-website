import React from 'react';
import PropTypes from 'prop-types';

const FormElementTitle = ({ title }) => <h2>{title}</h2>;

FormElementTitle.prototype = {
  title: PropTypes.string,
};

export default FormElementTitle;
