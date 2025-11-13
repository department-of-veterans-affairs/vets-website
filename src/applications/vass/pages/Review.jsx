import React from 'react';
import Wrapper from '../layout/Wrapper';

const Review = () => {
  return (
    <Wrapper pageTitle="Review your appointment details">
      <va-link
        href="/service-member/benefits/solid-start/schedule/confirmation"
        text="Confirm"
      />
    </Wrapper>
  );
};

export default Review;
