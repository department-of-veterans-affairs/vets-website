import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { parseISO } from 'date-fns';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { api } from '../../api';

import { createAnalyticsSlug } from '../../utils/analytics';
import { useFormRouting } from '../../hooks/useFormRouting';
import { ELIGIBILITY, areEqual } from '../../utils/appointment/eligibility';

import { CheckInButton } from './CheckInButton';
import { useUpdateError } from '../../hooks/useUpdateError';

const AppointmentActionVaos = props => {
  const { appointment, router, token, event } = props;

  const { updateError } = useUpdateError();

  const { jumpToPage } = useFormRouting(router);
  const onClick = useCallback(
    async () => {
      if (event) {
        recordEvent({
          event: createAnalyticsSlug(event, 'nav'),
        });
      }
      try {
        const json = await api.v2.postCheckInData({
          uuid: token,
          appointmentIen: appointment.appointmentIen,
          facilityId: appointment.facilityId,
        });
        const { status } = json;
        if (status === 200) {
          jumpToPage(`complete/${appointment.appointmentIen}`);
        } else {
          updateError('check-in-post-error');
        }
      } catch (error) {
        updateError('error-completing-check-in');
      }
    },
    [appointment, updateError, jumpToPage, token, event],
  );
  if (
    appointment.eligibility &&
    areEqual(appointment.eligibility, ELIGIBILITY.ELIGIBLE)
  ) {
    return (
      <CheckInButton
        checkInWindowEnd={parseISO(appointment.checkInWindowEnd)}
        appointmentTime={
          appointment.startTime ? parseISO(appointment.startTime) : null
        }
        onClick={onClick}
        router={router}
      />
    );
  }
  return <></>;
};

AppointmentActionVaos.propTypes = {
  appointment: PropTypes.object,
  event: PropTypes.string,
  router: PropTypes.object,
  token: PropTypes.string,
};

export default AppointmentActionVaos;
