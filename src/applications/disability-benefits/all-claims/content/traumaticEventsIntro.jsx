import React from 'react';
import { rememberTextBlob } from './form0781';

export const eventsPageTitle = 'Traumatic events';

export const eventsIntroDescription = () => {
  return (
    // <>
    //   <p>
    //     Enter details about the traumatic events you experienced during your
    //     military service.
    //   </p>
    //   <p>
    //     Any information you provide will help us understand your situation and
    //     identify evidence to support your claim. All questions are optional. You
    //     only need to provide details you’re comfortable sharing.
    //   </p>
    //   <h4>Information we’ll ask you for</h4>
    //   <p>
    //     We’ll ask you for this information:
    //     <ul>
    //       <li>
    //         Whether your event was related to combat, personal interactions,
    //         military sexual trauma (MST), something else, or any combination of
    //         these
    //       </li>
    //       <li>
    //         A brief description, location, and approximate time frame of your
    //         event
    //       </li>
    //       <li>
    //         Details about any official reports that were filed, if applicable
    //       </li>
    //     </ul>
    //   </p>
    //   <h4>You can take a break at any time</h4>
    //   <p>
    //     We understand that some of the questions may be difficult to answer. You
    //     can take a break at any time. We’ll save the information you enter so
    //     you can finish your application later.
    //   </p>
    // </>
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
