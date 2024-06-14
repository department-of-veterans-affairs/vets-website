import PropTypes from 'prop-types';
import React from 'react';

const FormElementTitle = ({ title }) => <h2>{title}</h2>;

FormElementTitle.propTypes = {
  title: PropTypes.string,
};

export default FormElementTitle;
