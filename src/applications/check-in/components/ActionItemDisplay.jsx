import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { createAnalyticsSlug } from '../utils/analytics';
import { useFormRouting } from '../hooks/useFormRouting';

import { setForm } from '../actions/universal';
import { makeSelectApp, makeSelectVeteranData } from '../selectors';
import { APP_NAMES } from '../utils/appConstants';
import {
  preCheckinAlreadyCompleted,
  getAppointmentId,
} from '../utils/appointment';

import WhatToDoNext from './WhatToDoNext';
import PreCheckInSuccessAlert from './PreCheckInSuccessAlert';

const ActionItemDisplay = props => {
  const { router } = props;
  const dispatch = useDispatch();
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { goToNextPage, jumpToPage, pages } = useFormRouting(router);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);

  const displaySuccessAlert =
    app === APP_NAMES.PRE_CHECK_IN &&
    (preCheckinAlreadyCompleted(appointments) || pages.length < 5);

  const action = (e, appointmentId) => {
    e.preventDefault();
    dispatch(
      setForm({
        data: {
          activeAppointmentId: appointmentId,
        },
      }),
    );
    goToNextPage();
  };

  const goToDetails = (e, appointment) => {
    e.preventDefault();
    recordEvent({
      event: createAnalyticsSlug('details-link-clicked', 'nav', app),
    });
    jumpToPage(`appointment-details/${getAppointmentId(appointment)}`);
  };

  return (
    <>
      {displaySuccessAlert ? (
        <PreCheckInSuccessAlert />
      ) : (
        <section data-testid="what-to-do-next">
          <WhatToDoNext
            router={router}
            appointments={appointments}
            goToDetails={goToDetails}
            action={action}
          />
        </section>
      )}
    </>
  );
};

ActionItemDisplay.propTypes = {
  router: PropTypes.object,
};

export default ActionItemDisplay;
