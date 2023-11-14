import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import AppointmentBlock from './AppointmentBlock';
import ExternalLink from './ExternalLink';
import PreCheckInAccordionBlock from './PreCheckInAccordionBlock';
import HowToLink from './HowToLink';
import Wrapper from './layout/Wrapper';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

const PreCheckinConfirmation = props => {
  const { appointments, isLoading, formData, router } = props;
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  // appt link will be /my-health/appointments if toggle is on
  const apptLink = useToggleValue(
    TOGGLE_NAMES.vaOnlineSchedulingBreadcrumbUrlUpdate,
  )
    ? 'https://va.gov/my-health/appointments/'
    : 'https://va.gov/health-care/schedule-view-va-appointments/appointments/';

  // If the demographics answers are not present in the data, we
  // assume that the page was skipped, and default to "yes".
  const demographicsUpToDate = formData.demographicsUpToDate ?? 'yes';
  const emergencyContactUpToDate = formData.emergencyContactUpToDate ?? 'yes';
  const nextOfKinUpToDate = formData.nextOfKinUpToDate ?? 'yes';

  const { t } = useTranslation();

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
      <Wrapper
        pageTitle={t('youve-successfully-reviewed-your-contact-information')}
        testID="confirmation-wrapper"
      >
        <AppointmentBlock
          appointments={appointments}
          page="confirmation"
          router={router}
        />
        <HowToLink />
        <p className="vads-u-margin-bottom--4">
          <ExternalLink href={apptLink} hrefLang="en">
            {t('sign-in-to-manage')}
          </ExternalLink>
        </p>

        <PreCheckInAccordionBlock
          demographicsUpToDate={demographicsUpToDate}
          emergencyContactUpToDate={emergencyContactUpToDate}
          nextOfKinUpToDate={nextOfKinUpToDate}
          appointments={appointments}
        />
      </Wrapper>
    );
  };

  return isLoading ? renderLoadingMessage() : renderConfirmationMessage();
};

PreCheckinConfirmation.propTypes = {
  appointments: PropTypes.array,
  formData: PropTypes.object,
  isLoading: PropTypes.bool,
  router: PropTypes.object,
};

export default PreCheckinConfirmation;
