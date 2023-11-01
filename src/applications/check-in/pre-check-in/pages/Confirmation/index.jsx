import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import PreCheckinConfirmation from '../../../components/PreCheckinConfirmation';

import { useSendPreCheckInData } from '../../../hooks/useSendPreCheckInData';

import { makeSelectForm, makeSelectVeteranData } from '../../../selectors';

const Confirmation = props => {
  const { router } = props;

  const { isLoading } = useSendPreCheckInData();

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);

  const selectForm = useMemo(makeSelectForm, []);
  const { data: formData } = useSelector(selectForm);

  return (
    <PreCheckinConfirmation
      appointments={appointments}
      isLoading={isLoading}
      formData={formData}
      router={router}
    />
  );
};

Confirmation.propTypes = {
  router: PropTypes.object,
};

export default Confirmation;
