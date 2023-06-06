import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import ExternalLink from './ExternalLink';

const HowToLink = props => {
  const { apptType } = props;
  const { t } = useTranslation();

  if (apptType !== 'clinic') {
    return <></>;
  }

  return (
    <p className="vads-u-margin-bottom--4" data-testid="how-to-link">
      <ExternalLink
        href="https://www.va.gov/resources/how-to-check-in-with-your-smartphone-for-some-va-appointments/"
        hrefLang="en"
        eventId="how-to-check-in-clicked"
        eventPrefix="nav"
      >
        {t('find-out-how-to-check-in-on-the-day-of-your-appointment')}
      </ExternalLink>
    </p>
  );
};

HowToLink.propTypes = {
  apptType: PropTypes.string.isRequired,
};

export default HowToLink;
