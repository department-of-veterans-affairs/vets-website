import React from 'react';
import PropTypes from 'prop-types';

const MoreInformation = props => {
  // eslint-disable-next-line no-unused-vars
  const { avs } = props;

  return <p>More information.</p>;
};

export default MoreInformation;

MoreInformation.propTypes = {
  avs: PropTypes.object,
};
