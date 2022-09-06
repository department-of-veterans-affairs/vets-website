import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

import { createAnalyticsSlug } from '../utils/analytics';

function ExternalLink({ children, href, hrefLang, eventId = null }) {
  const { t, i18n } = useTranslation();

  const handleClick = useCallback(
    () => {
      recordEvent({
        event: createAnalyticsSlug(eventId),
      });
    },
    [eventId],
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <a {...{ href, hrefLang }} onClick={eventId ? handleClick : null}>
      {children}
      {!i18n?.language.startsWith(hrefLang) ? (
        <> ({t(`in-${hrefLang}`)})</>
      ) : null}
    </a>
  );
}

ExternalLink.propTypes = {
  children: PropTypes.node,
  eventId: PropTypes.string,
  href: PropTypes.string,
  hrefLang: PropTypes.string,
};

export default ExternalLink;
