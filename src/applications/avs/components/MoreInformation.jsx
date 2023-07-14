import React from 'react';
import PropTypes from 'prop-types';

const MoreInformation = props => {
  const { avs } = props;
  // eslint-disable-next-line no-console
  console.log(avs);

  return <p>More information.</p>;
};

export default MoreInformation;

MoreInformation.propTypes = {
  avs: PropTypes.object,
};
