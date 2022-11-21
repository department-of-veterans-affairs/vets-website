import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import AppointmentBlock from './AppointmentBlock';
import ExternalLink from './ExternalLink';
import PreCheckInAccordionBlock from './PreCheckInAccordionBlock';
import HowToLink from './HowToLink';
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
  const apptType = appointments[0]?.kind ?? 'clinic';
  const renderLoadingMessage = () => {
    return (
      <va-loading-indicator
        data-testid="loading-indicator"
        message={t('completing-pre-check-in')}
      />
    );
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
        <AppointmentBlock appointments={appointments} page="confirmation" />
        <HowToLink apptType={apptType} />
        <p className="vads-u-margin-bottom--4">
          <ExternalLink
            href="https://va.gov/health-care/schedule-view-va-appointments/appointments/"
            hrefLang="en"
          >
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
};

export default PreCheckinConfirmation;
