import PropTypes from 'prop-types';
import React from 'react';

const FormElementTitle = ({ title }) => <h3>{title}</h3>;

FormElementTitle.propTypes = {
  title: PropTypes.string,
};

export default FormElementTitle;
