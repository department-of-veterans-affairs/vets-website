import React from 'react';
import { useTranslation } from 'react-i18next';
import ExternalLink from './ExternalLink';

const HowToLink = () => {
  const { t } = useTranslation();

  return (
    <p className="vads-u-margin-bottom--2" data-testid="how-to-link">
      <ExternalLink
        href="https://www.va.gov/resources/how-to-check-in-with-your-smartphone-for-some-va-appointments/"
        hrefLang="en"
        eventId="how-to-check-in-clicked"
        eventPrefix="nav"
        target="_blank"
      >
        {t('find-out-how-to-check-in-opens-in-new-tab')}
      </ExternalLink>
    </p>
  );
};

export default HowToLink;
