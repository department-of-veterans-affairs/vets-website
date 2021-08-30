import React from 'react';

export default function TypeHeader({ children, isVideo = false }) {
  return (
    <h2
      className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0"
      data-cy={
        isVideo
          ? 'va-video-appointment-details-header'
          : 'va-appointment-details-header'
      }
    >
      {children}
    </h2>
  );
}
