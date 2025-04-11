import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import recordEvent from '~/platform/monitoring/record-event';

export default function SituationUpdateBanner({
  entityId,
  alertType,
  headline,
  showClose,
  content,
  operatingStatusCta = false,
  operatingStatusPage,
  findFacilitiesCta = false,
}) {
  const bannerId = `situation-update-banner-${entityId}`;

  return (
    <va-banner
      data-testid="situation-update-banner"
      banner-id={bannerId}
      type={alertType}
      headline={headline}
      show-close={showClose}
      dismissed-banner-id={bannerId}
    >
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
      {operatingStatusCta && operatingStatusPage && (
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
      {findFacilitiesCta && (
        <p>
          <va-link
            href="/find-locations"
            text="Find other VA facilities near you"
          />
        </p>
      )}
    </va-banner>
  );
}

SituationUpdateBanner.propTypes = {
  alertType: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  entityId: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  findFacilitiesCta: PropTypes.bool,
  operatingStatusCta: PropTypes.bool,
  operatingStatusPage: PropTypes.string,
  showClose: PropTypes.bool,
};
