import React from 'react';
import PropTypes from 'prop-types';

export default function SituationUpdateBanner({
  id,
  alertType,
  headline,
  showClose,
  content,
}) {
  return (
    <va-banner
      banner-id={id}
      type={alertType}
      headline={headline}
      show-close={showClose}
    >
      <div slot="content">
        <span>{content}</span>
      </div>
    </va-banner>
  );
}

SituationUpdateBanner.propTypes = {
  alertType: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  headline: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  showClose: PropTypes.bool,
};
