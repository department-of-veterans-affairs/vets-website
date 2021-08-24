// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import EmergencyBanner from '@department-of-veterans-affairs/component-library/EmergencyBanner';
// Relative imports.
import recordEvent from 'platform/monitoring/record-event';

export const Banner = ({
  content,
  dismissibleStatus,
  title,
  type,
  visible,
}) => (
  <EmergencyBanner
    content={content}
    localStorage={localStorage}
    recordEvent={recordEvent}
    showClose={dismissibleStatus !== 'perm'}
    title={title}
    type={type}
    visible={visible === 'true'}
  />
);

Banner.propTypes = {
  content: PropTypes.string.isRequired,
  dismissibleStatus: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  visible: PropTypes.string.isRequired,
};

export default Banner;
