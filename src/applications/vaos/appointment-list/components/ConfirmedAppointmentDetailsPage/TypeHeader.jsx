import React from 'react';
import PropTypes from 'prop-types';

export default function TypeHeader({
  children,
  isVideo = false,
  isCC = false,
}) {
  const dataCy = () => {
    if (isVideo) {
      return 'va-video-appointment-details-header';
    }
    if (isCC) {
      return 'community-care-appointment-details-header';
    }
    return 'va-appointment-details-header';
  };

  return (
    <h2
      className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0"
      data-cy={dataCy()}
    >
      {children}
    </h2>
  );
}
TypeHeader.propTypes = {
  children: PropTypes.string,
  isCC: PropTypes.bool,
  isVideo: PropTypes.bool,
};
