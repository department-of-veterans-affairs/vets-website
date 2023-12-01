import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import DisplayMultipleAppointments from './DisplayMultipleAppointments';
import { useSendDemographicsFlags } from '../../../hooks/useSendDemographicsFlags';

import {
  makeSelectVeteranData,
  makeSelectCurrentContext,
} from '../../../selectors';

const CheckIn = props => {
  const { router } = props;
  const { t } = useTranslation();
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const context = useSelector(selectCurrentContext);
  useSendDemographicsFlags();

  const { token } = context;

  if (appointments?.length < 1) {
    window.scrollTo(0, 0);
    return (
      <div>
        <va-loading-indicator
          data-testid="loading-indicator"
          message={t('loading-your-appointments-for-today')}
        />
      </div>
    );
  }

  return (
    <DisplayMultipleAppointments
      router={router}
      token={token}
      appointments={appointments}
    />
  );
};

CheckIn.propTypes = {
  appointments: PropTypes.array,
  isLoading: PropTypes.bool,
  router: PropTypes.object,
};

export default CheckIn;
