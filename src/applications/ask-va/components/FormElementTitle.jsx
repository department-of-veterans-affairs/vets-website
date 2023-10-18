import React from 'react';
import PropTypes from 'prop-types';

const FormElementTitle = ({ title }) => <h3>{title}</h3>;

FormElementTitle.prototype = {
  title: PropTypes.string,
};

export default FormElementTitle;
