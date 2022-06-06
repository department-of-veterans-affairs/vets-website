import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import AppointmentBlock from './AppointmentBlock';
import BackToHome from './BackToHome';
import LanguagePicker from './LanguagePicker';
import ExternalLink from './ExternalLink';
import PreCheckInAccordionBlock from './PreCheckInAccordionBlock';

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
      <div
        className="vads-l-grid-container vads-u-padding-bottom--3 vads-u-padding-top--3"
        data-testid="confirmation-wrapper"
      >
        <LanguagePicker />
        <h1 tabIndex="-1" className="vads-u-margin-top--2">
          {t('youve-completed-pre-check-in')}
        </h1>
        <AppointmentBlock appointments={appointments} />
        <p className="vads-u-margin-bottom--4">
          <ExternalLink
            href="https://va.gov/health-care/schedule-view-va-appointments/appointments/"
            hrefLang="en"
          >
            {t('go-to-your-appointment-details')}
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
      </div>
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
