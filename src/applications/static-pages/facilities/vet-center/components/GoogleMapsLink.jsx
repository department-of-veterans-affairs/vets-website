import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';

const GoogleMapsLink = props => {
  const { addressDirections, title } = props;
  if (!addressDirections) return null;
  return (
    <a
      onClick={() => {
        recordEvent({
          event: 'directions-link-click',
          'va-facility-name': title,
        });
      }}
      href={`https://www.google.com/maps?saddr=Current+Location&daddr=${addressDirections}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Get directions on Google Maps{' '}
      <span className="sr-only">{`to ${title}`}</span>
    </a>
  );
};

GoogleMapsLink.propTypes = {
  addressDirections: PropTypes.string,
  title: PropTypes.string,
};

GoogleMapsLink.propTypes = {
  addressDirections: PropTypes.string,
  title: PropTypes.string,
};

export default GoogleMapsLink;
