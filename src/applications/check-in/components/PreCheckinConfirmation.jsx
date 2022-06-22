import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import AppointmentBlock from './AppointmentBlock';
import BackToHome from './BackToHome';
import ExternalLink from './ExternalLink';
import PreCheckInAccordionBlock from './PreCheckInAccordionBlock';
import Wrapper from './layout/Wrapper';

const PreCheckinConfirmation = props => {
  const { appointments, isLoading, formData } = props;
  const {
    demographicsUpToDate,
    emergencyContactUpToDate,
    nextOfKinUpToDate,
  } = formData;
  const { t } = useTranslation();

  if (appointments.length === 0) {
    return <></>;
  }

  const renderLoadingMessage = () => {
    return <va-loading-indicator message={t('completing-pre-check-in')} />;
  };
  const renderConfirmationMessage = () => {
    if (appointments.length === 0) {
      return <></>;
    }
    return (
      <Wrapper
        pageTitle={t('youve-completed-pre-check-in')}
        testID="confirmation-wrapper"
      >
        <AppointmentBlock appointments={appointments} />
        <p className="vads-u-margin-bottom--4">
          <ExternalLink
            href="https://va.gov/health-care/schedule-view-va-appointments/appointments/"
            hrefLang="en"
          >
            {t('sign-in-to-manage')}
          </ExternalLink>
        </p>
        <va-alert
          background-only
          status="info"
          show-icon
          data-testid="confirmation-update-alert"
          class="vads-u-margin-bottom--3"
        >
          <div>
            {t(
              'please-bring-your-insurance-cards-with-you-to-your-appointment',
            )}
          </div>
        </va-alert>
        <PreCheckInAccordionBlock
          demographicsUpToDate={demographicsUpToDate}
          emergencyContactUpToDate={emergencyContactUpToDate}
          nextOfKinUpToDate={nextOfKinUpToDate}
          appointments={appointments}
        />
        <BackToHome />
      </Wrapper>
    );
  };

  return isLoading ? renderLoadingMessage() : renderConfirmationMessage();
};

PreCheckinConfirmation.propTypes = {
  appointments: PropTypes.array,
  formData: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default PreCheckinConfirmation;
