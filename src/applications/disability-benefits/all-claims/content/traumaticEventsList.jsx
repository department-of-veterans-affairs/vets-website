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
      <p>You’ve added the maximum number of traumatic events for this claim.</p>
      <ul>
        <li>
          To revise your traumatic events you may edit or delete an event before
          continuing.
        </li>
        <li>
          You may also print this form, fill it out, and mail it to us.{' '}
          <va-link
            href="https://www.va.gov/find-forms/about-form-21-0781/"
            text="Get VA Form 21-0781"
          />
        </li>
      </ul>
      <p>
        <strong>
          Send your completed form and supporting documents to this address:
        </strong>
      </p>
      <p>
        Department of Veterans Affairs
        <br />
        Evidence Intake Center
        <br />
        P.O. Box 4444
        <br />
        Janesville, WI 53547-4444
      </p>
    </>
  );
};
