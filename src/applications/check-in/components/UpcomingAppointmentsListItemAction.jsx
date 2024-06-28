import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { setForm } from '../actions/universal';
import { useFormRouting } from '../hooks/useFormRouting';
import { ELIGIBILITY, areEqual } from '../utils/appointment/eligibility';
import { getAppointmentId } from '../utils/appointment';

const UpcomingAppointmentsListItemAction = props => {
  const { appointment, router } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goToNextPage, jumpToPage, getNextPageFromRouter } = useFormRouting(
    router,
  );
  const nextPage = getNextPageFromRouter();

  const action = (e, appointmentId) => {
    e.preventDefault();
    dispatch(
      setForm({
        data: {
          activeAppointmentId: appointmentId,
        },
      }),
    );
    if (nextPage === 'complete') {
      jumpToPage(`complete/${appointmentId}`);
    } else {
      goToNextPage();
    }
  };

  if (
    appointment.eligibility &&
    areEqual(appointment.eligibility, ELIGIBILITY.ELIGIBLE)
  ) {
    return (
      <p>
        <va-link
          href="/"
          active
          onClick={e => action(e, getAppointmentId(appointment))}
          text={t('check-in-now')}
          data-testid="action-link"
        />
      </p>
    );
  }
  return <></>;
};

UpcomingAppointmentsListItemAction.propTypes = {
  appointment: PropTypes.object,
  router: PropTypes.object,
};

export default UpcomingAppointmentsListItemAction;
