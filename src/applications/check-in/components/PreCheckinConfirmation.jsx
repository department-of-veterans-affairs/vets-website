import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import AppointmentBlock from './AppointmentBlock';
import ExternalLink from './ExternalLink';
import ConfirmationAccordionBlock from './ConfirmationAccordionBlock';
import HowToLink from './HowToLink';
import PrepareContent from './PrepareContent';
import Wrapper from './layout/Wrapper';

import { makeSelectForm } from '../selectors';

const PreCheckinConfirmation = props => {
  const { appointments, isLoading, router } = props;
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const selectForm = useMemo(makeSelectForm, []);
  const currentForm = useSelector(selectForm);

  // appt link will be /my-health/appointments if toggle is on
  const apptLink = useToggleValue(
    TOGGLE_NAMES.vaOnlineSchedulingBreadcrumbUrlUpdate,
  )
    ? 'https://va.gov/my-health/appointments/'
    : 'https://va.gov/health-care/schedule-view-va-appointments/appointments/';

  const { t } = useTranslation();
  const pageTitle =
    currentForm.pages.length < 5
      ? t('your-information-is-up-to-date')
      : t('youve-successfully-reviewed-your-contact-information');

  if (appointments.length === 0) {
    return <></>;
  }

  const renderLoadingMessage = () => {
    return (
      <div>
        <va-loading-indicator
          data-testid="loading-indicator"
          message={t('completing-pre-check-in')}
        />
      </div>
    );
  };
  const renderConfirmationMessage = () => {
    if (appointments.length === 0) {
      return <></>;
    }
    return (
      <Wrapper pageTitle={pageTitle} testID="confirmation-wrapper">
        <AppointmentBlock
          appointments={appointments}
          page="confirmation"
          router={router}
        />
        <PrepareContent router={router} />
        <HowToLink />
        <p className="vads-u-margin-bottom--4">
          <ExternalLink href={apptLink} hrefLang="en">
            {t('sign-in-to-manage')}
          </ExternalLink>
        </p>

        <ConfirmationAccordionBlock appointments={appointments} />
      </Wrapper>
    );
  };

  return isLoading ? renderLoadingMessage() : renderConfirmationMessage();
};

PreCheckinConfirmation.propTypes = {
  appointments: PropTypes.array,
  isLoading: PropTypes.bool,
  router: PropTypes.object,
};

export default PreCheckinConfirmation;
