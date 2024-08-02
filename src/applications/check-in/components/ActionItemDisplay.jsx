import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { createAnalyticsSlug } from '../utils/analytics';
import { useFormRouting } from '../hooks/useFormRouting';

import { setForm } from '../actions/universal';
import { makeSelectApp, makeSelectVeteranData } from '../selectors';
import { getAppointmentId } from '../utils/appointment';

import WhatToDoNext from './WhatToDoNext';

const ActionItemDisplay = props => {
  const { router } = props;
  const dispatch = useDispatch();
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { goToNextPage, jumpToPage, getNextPageFromRouter } = useFormRouting(
    router,
  );
  const nextPage = getNextPageFromRouter();
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);

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

  const goToDetails = (e, appointment) => {
    e.preventDefault();
    recordEvent({
      event: createAnalyticsSlug('details-link-clicked', 'nav', app),
    });
    jumpToPage(`appointment-details/${getAppointmentId(appointment)}`);
  };

  return (
    <section data-testid="what-to-do-next">
      <WhatToDoNext
        router={router}
        appointments={appointments}
        goToDetails={goToDetails}
        action={action}
      />
    </section>
  );
};

ActionItemDisplay.propTypes = {
  router: PropTypes.object,
};

export default ActionItemDisplay;
