import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';

import AppointmentBlock from './AppointmentBlock';
import AppointmentBlockWithIcons from './AppointmentBlockWithIcons';
import BackToHome from './BackToHome';
import ExternalLink from './ExternalLink';
import PreCheckInAccordionBlock from './PreCheckInAccordionBlock';
import Wrapper from './layout/Wrapper';
import Footer from './layout/Footer';

const PreCheckinConfirmation = props => {
  const { appointments, isLoading, formData } = props;
  const {
    demographicsUpToDate,
    emergencyContactUpToDate,
    nextOfKinUpToDate,
  } = formData;
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isPhoneAppointmentsEnabled } = useSelector(selectFeatureToggles);
  const { t } = useTranslation();

  if (appointments.length === 0) {
    return <></>;
  }

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
        {isPhoneAppointmentsEnabled ? (
          <AppointmentBlockWithIcons
            appointments={appointments}
            page="confirmation"
          />
        ) : (
          <AppointmentBlock appointments={appointments} />
        )}
        <p className="vads-u-margin-bottom--4">
          <ExternalLink
            href="https://va.gov/health-care/schedule-view-va-appointments/appointments/"
            hrefLang="en"
          >
            {t('sign-in-to-manage')}
          </ExternalLink>
        </p>
        {!isPhoneAppointmentsEnabled && (
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
        )}

        <PreCheckInAccordionBlock
          demographicsUpToDate={demographicsUpToDate}
          emergencyContactUpToDate={emergencyContactUpToDate}
          nextOfKinUpToDate={nextOfKinUpToDate}
          appointments={appointments}
        />
        <BackToHome />
        <Footer />
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
