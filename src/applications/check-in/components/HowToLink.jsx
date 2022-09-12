import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';

import ExternalLink from './ExternalLink';

const HowToLink = props => {
  const { apptType } = props;
  const { t } = useTranslation();
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isPhoneAppointmentsEnabled } = useSelector(selectFeatureToggles);

  if (isPhoneAppointmentsEnabled && apptType !== 'clinic') {
    return <></>;
  }

  return (
    <p className="vads-u-margin-bottom--4">
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
