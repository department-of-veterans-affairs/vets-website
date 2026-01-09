import PropTypes from 'prop-types';
import React from 'react';
import Section from '../../Section';

export function CCDetails({ otherDetails, request, level = 2 }) {
  const heading = request
    ? 'Details you’d like to share with your provider'
    : 'Details you shared with your provider';
  return (
    <Section heading={heading} level={level}>
      <span className="vaos-u-word-break--break-word" data-dd-privacy="mask">
        Other details: {`${otherDetails || 'Not available'}`}
      </span>
    </Section>
  );
}
CCDetails.propTypes = {
  level: PropTypes.number,
  otherDetails: PropTypes.string,
  request: PropTypes.bool,
};
