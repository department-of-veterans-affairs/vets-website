import React from 'react';

export const eventsListPageTitle =
  'Traumatic events from your military service';

export const eventsListDescription = () => {
  return (
    <>
      <p>
        Any information you provide about your event will help us understand
        your situation and identify evidence to support your claim.
      </p>
      <p>
        You can tell us about a single event, or a recurring or ongoing
        experience.{' '}
        <strong>
          You can add up to 20 events to your disability application.
        </strong>
      </p>
      <p>
        It’s also OK if you don’t add an event. You can skip this question if
        you don’t feel comfortable answering. Select <strong>Continue</strong>{' '}
        to go to the next question.
      </p>
    </>
  );
};

export const maxEventsAlert = () => {
  return (
    <>
      <p>
        Our online claim supports up to 20 events. If you need to add more,
        here’s what to do:
      </p>
      <ul>
        <li>
          Edit or delete an event in your list and replace it with another, or
        </li>
        <li>
          Download a PDF of VA Form 21-0781 and follow the instructions to send
          your completed form to us by mail.{' '}
          <va-link
            external
            href="https://www.va.gov/find-forms/about-form-21-0781/"
            text="Get VA Form 21-0781 to download"
          />
        </li>
      </ul>
    </>
  );
};

export const policeRemovedRemovedAlert = () => {
  return (
    <>
      <p>Police report removed</p>
    </>
  );
};
