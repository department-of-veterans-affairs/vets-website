import React from 'react';
import PropTypes from 'prop-types';

const ArrayTitle = ({ title }) => (
  <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">{title}</h3>
);

ArrayTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ArrayTitle;
