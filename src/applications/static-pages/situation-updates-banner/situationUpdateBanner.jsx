import React, { useRef, useEffect } from 'react';
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
  findFacilitiesCta = false,
}) {
  const contentRef = useRef(null);

  useEffect(
    () => {
      if (contentRef.current) {
        contentRef.current.innerHTML = DOMPurify.sanitize(content);
      }
    },
    [content],
  );

  return (
    <va-banner
      data-testid="situation-update-banner"
      banner-id={`situation-update-banner-${id}`}
      type={alertType}
      headline={headline}
      show-close={showClose}
    >
      <div ref={contentRef} className="situation-update-content" />
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
  headline: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  findFacilitiesCta: PropTypes.bool,
  operatingStatusCta: PropTypes.bool,
  operatingStatusPage: PropTypes.string,
  showClose: PropTypes.bool,
};
