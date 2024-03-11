import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { makeSelectApp } from '../selectors';

import { createAnalyticsSlug } from '../utils/analytics';

function ExternalLink({
  children,
  href,
  hrefLang,
  eventId = null,
  eventPrefix = '',
  dataTestId = 'external-link',
  target = null,
  rel = null,
  className,
}) {
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t, i18n } = useTranslation();

  const handleClick = useCallback(
    () => {
      recordEvent({
        event: createAnalyticsSlug(eventId, eventPrefix, app),
      });
    },
    [app, eventId, eventPrefix],
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <a
      {...{ href, hrefLang, target, rel, className }}
      onClick={eventId ? handleClick : null}
      data-testid={dataTestId}
    >
      {children}
      {!i18n?.language.startsWith(hrefLang) ? (
        <> ({t(`in-${hrefLang}`)})</>
      ) : null}
    </a>
  );
}

ExternalLink.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  eventId: PropTypes.string,
  eventPrefix: PropTypes.string,
  href: PropTypes.string,
  hrefLang: PropTypes.string,
  rel: PropTypes.string,
  target: PropTypes.string,
};

export default ExternalLink;
