import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';

import AppointmentBlock from './AppointmentBlock';
import AppointmentBlockVaos from './AppointmentBlockVaos';
import ExternalLink from './ExternalLink';
import PreCheckInAccordionBlock from './PreCheckInAccordionBlock';
import HowToLink from './HowToLink';
import Wrapper from './layout/Wrapper';

const PreCheckinConfirmation = props => {
  const { appointments, isLoading, formData, router } = props;
  const {
    demographicsUpToDate,
    emergencyContactUpToDate,
    nextOfKinUpToDate,
  } = formData;
  const { t } = useTranslation();
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);

  const { isUpdatedApptPresentationEnabled } = useSelector(
    selectFeatureToggles,
  );

  if (appointments.length === 0) {
    return <></>;
  }

  const apptType = appointments[0]?.kind ?? 'clinic';
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
        pageTitle={t('youve-completed-pre-check-in')}
        testID="confirmation-wrapper"
      >
        {isUpdatedApptPresentationEnabled ? (
          <AppointmentBlockVaos
            appointments={appointments}
            page="complete"
            router={router}
          />
        ) : (
          <AppointmentBlock appointments={appointments} page="confirmation" />
        )}
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
  router: PropTypes.object,
};

export default PreCheckinConfirmation;
