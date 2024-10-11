import React from 'react';
import PropTypes from 'prop-types';

const LiText = ({ text }) => <li>{text}</li>;

LiText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default LiText;
