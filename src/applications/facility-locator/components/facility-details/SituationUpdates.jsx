import React from 'react';
import PropTypes from 'prop-types';

// defaultBanner is being added for testing purposes and should be removed before
// by #19453 prior to this going live with #19471
const defaultUpdate = {
  fieldDismissibleOption: 'dismiss-session',
  title: 'Test Banner Title',
  fieldAlertType: 'info',
  body: {
    processed:
      'This is a test banner message. You can modify this content for testing purposes.',
  },
};

export default function SituationUpdates({ banner = defaultUpdate }) {
  const showClose = banner.fieldDismissibleOption !== 'perm';
  const isSessionBased = banner.fieldDismissibleOption === 'dismiss-session';

  return (
    <va-banner
      data-template="components/banners.drupal.liquid"
      show-close={showClose}
      window-session={isSessionBased}
      headline={banner.title}
      type={banner.fieldAlertType || 'info'}
      visible
    >
      {banner.body.processed}
    </va-banner>
  );
}

SituationUpdates.propTypes = {
  banner: PropTypes.shape({
    fieldDismissibleOption: PropTypes.string,
    title: PropTypes.string.isRequired,
    fieldAlertType: PropTypes.string,
    body: PropTypes.shape({
      processed: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
