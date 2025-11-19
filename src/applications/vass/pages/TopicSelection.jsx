import React from 'react';
import Wrapper from '../layout/Wrapper';

const TopicSelection = () => {
  return (
    <Wrapper
      pageTitle="What topic would you like to talk about?"
      showBackButton
    >
      <va-link
        href="/service-member/benefits/solid-start/schedule/review"
        text="Continue"
      />
    </Wrapper>
  );
};

export default TopicSelection;
