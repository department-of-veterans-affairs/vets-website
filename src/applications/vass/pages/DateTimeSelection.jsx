import React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import Wrapper from '../layout/Wrapper';
import { usePersistentSelections } from '../hooks/usePersistentSelections';

// TODO: remove this once we have a real UUID
const UUID = 'af40d0e7-df29-4df3-8b5e-03eac2e760fa';

const DateTimeSelection = () => {
  const navigate = useNavigate();
  const { saveDateSelection } = usePersistentSelections(UUID);

  const handleContinue = () => {
    saveDateSelection(new Date().toISOString());
    navigate('/topic-selection');
  };

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
    </Wrapper>
  );
};

export default DateTimeSelection;
