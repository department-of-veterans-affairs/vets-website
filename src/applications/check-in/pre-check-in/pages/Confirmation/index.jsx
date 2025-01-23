import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import PreCheckinConfirmation from '../../../components/PreCheckinConfirmation';

import { useSendPreCheckInData } from '../../../hooks/useSendPreCheckInData';

import { makeSelectVeteranData } from '../../../selectors';

const Confirmation = props => {
  const { router } = props;

  const { isLoading } = useSendPreCheckInData();

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);

  return (
    <PreCheckinConfirmation
      appointments={appointments}
      isLoading={isLoading}
      router={router}
    />
  );
};

Confirmation.propTypes = {
  router: PropTypes.object,
};

export default Confirmation;
