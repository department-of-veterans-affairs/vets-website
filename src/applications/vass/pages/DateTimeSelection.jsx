import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom-v5-compat';

import Wrapper from '../layout/Wrapper';
import { usePersistentSelections } from '../hooks/usePersistentSelections';
import { setSelectedDate, selectSelectedDate } from '../redux/slices/formSlice';

// TODO: remove this once we have a real UUID
const UUID = 'af40d0e7-df29-4df3-8b5e-03eac2e760fa';

const DateTimeSelection = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const navigate = useNavigate();
  const { saveDateSelection, getSaved } = usePersistentSelections(UUID);

  const saveDate = useCallback(
    date => {
      saveDateSelection(date);
      dispatch(setSelectedDate(date));
    },
    [saveDateSelection, dispatch],
  );

  const loadSavedDate = useCallback(
    () => {
      const savedDate = getSaved()?.selectedSlotTime;
      if (savedDate) {
        dispatch(setSelectedDate(savedDate));
      }
    },
    [getSaved, dispatch],
  );

  const handleContinue = () => {
    // TODO: add real date selection
    saveDate(new Date().toISOString());
    navigate('/topic-selection');
  };

  useEffect(
    () => {
      loadSavedDate();
    },
    [loadSavedDate],
  );

  return (
    <Wrapper
      pageTitle="What date and time do you want for this appointment?"
      showBackLink
    >
      <va-link
        href="/service-member/benefits/solid-start/schedule/topic-selection"
        text="Continue"
        onClick={handleContinue}
      />
      <p>
        TODO: show selected date
        {selectedDate ?? ''}
      </p>
    </Wrapper>
  );
};

export default DateTimeSelection;
