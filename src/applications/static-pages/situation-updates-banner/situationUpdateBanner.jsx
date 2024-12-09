import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import recordEvent from '~/platform/monitoring/record-event';

export default function SituationUpdateBanner({
  id,
  alertType,
  headline,
  showClose,
  content,
  operatingStatusCta = false,
  operatingStatusPage,
}) {
  return (
    <va-banner
      data-testid="situation-update-banner"
      banner-id={`situation-update-banner-${id}`}
      type={alertType}
      headline={headline}
      show-close={showClose}
    >
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
      {operatingStatusCta &&
        operatingStatusPage && (
          <p>
            <va-link
              disable-analytics
              onclick={recordEvent({
                event: 'nav-warning-alert-box-content-link-click',
                alertBoxHeading: headline,
              })}
              href={operatingStatusPage}
              text="Get updates on affected services and facilities"
            />
          </p>
        )}
    </va-banner>
  );
}

SituationUpdateBanner.propTypes = {
  alertType: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  headline: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  operatingStatusCta: PropTypes.bool,
  operatingStatusPage: PropTypes.string,
  showClose: PropTypes.bool,
};
