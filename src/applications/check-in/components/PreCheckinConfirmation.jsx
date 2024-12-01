import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import AppointmentBlock from './AppointmentBlock';
import LinkList from './LinkList';
import ConfirmationAccordionBlock from './ConfirmationAccordionBlock';
import PrepareContent from './PrepareContent';
import Wrapper from './layout/Wrapper';

import { makeSelectForm } from '../selectors';

const PreCheckinConfirmation = props => {
  const { appointments, isLoading, router } = props;
  const selectForm = useMemo(makeSelectForm, []);
  const currentForm = useSelector(selectForm);
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
        <PrepareContent
          router={router}
          appointmentCount={appointments.length}
        />
        <LinkList router={router} />
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
