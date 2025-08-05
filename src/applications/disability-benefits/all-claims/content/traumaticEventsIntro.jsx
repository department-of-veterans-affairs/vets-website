import React from 'react';
import { rememberTextBlob } from './form0781';

export const eventsPageTitle = 'Traumatic events';

export const eventsIntroDescription = () => {
  return (
    <>
      <p>In this section, we’ll ask you for this information:</p>
      <ul>
        <li>
          The type of traumatic events you experienced during service (such as
          events related to combat or personal interactions)
        </li>
        <li>
          A brief description of the events, including when and where they
          happened
        </li>
        <li>Any official reports filed about the events</li>
      </ul>
      {rememberTextBlob}
    </>
  );
};
