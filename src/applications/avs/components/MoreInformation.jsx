import React from 'react';
import PropTypes from 'prop-types';

const MoreInformation = props => {
  // eslint-disable-next-line no-unused-vars
  const { avs } = props;

  return (
    <div>
      <p className="vads-u-margin-top--0">More information.</p>;
    </div>
  );
};

export default MoreInformation;

MoreInformation.propTypes = {
  avs: PropTypes.object,
};
