import React from 'react';
import Wrapper from '../layout/Wrapper';

const DateTimeSelection = () => {
  return (
    <Wrapper
      pageTitle="What date and time do you want for this appointment?"
      showBackButton
    >
      <va-link
        href="/service-member/benefits/solid-start/schedule/topic-selection"
        text="Continue"
      />
    </Wrapper>
  );
};

export default DateTimeSelection;
