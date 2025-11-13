import React from 'react';
import PropTypes from 'prop-types';

export default function ListBestTimeToCall({ timesToCall }) {
  if (!Array.isArray(timesToCall) || timesToCall.length === 0) {
    return null;
  }

  const times = timesToCall.map(t => t.toLowerCase());

  let callText = '';
  if (times.length === 1) {
    callText = `Call ${times[0]}`;
  } else if (times.length === 2) {
    callText = `Call ${times[0]} or ${times[1]}`;
  } else {
    // Handles 3 or more times
    callText = `Call ${times.slice(0, -1).join(', ')}, or ${
      times[times.length - 1]
    }`;
  }
  return <span data-dd-privacy="mask">{callText}</span>;
}

ListBestTimeToCall.propTypes = {
  timesToCall: PropTypes.arrayOf(PropTypes.string),
};
