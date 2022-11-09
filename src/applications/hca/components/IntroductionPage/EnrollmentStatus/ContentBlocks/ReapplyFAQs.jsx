import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

// Declare reusable content blocks
const callOurTeam = (
  <>
    call our enrollment case management team at{' '}
    <va-telephone contact={CONTACTS['222_VETS']} />
  </>
);

// Declare content blocks for export
const reapplyBlock1 = (
  <>
    <h3 className="vads-u-font-size--h4">
      Will applying again update my information?
    </h3>
    <p>
      <strong>No. A new application won’t update your information.</strong> If
      you have questions about the information we have on record for you, please
      call your nearest VA medical center.
    </p>
    <p>
      <a className="usa-button-primary" href="/find-locations/">
        Find your VA medical center
      </a>
    </p>
  </>
);

const reapplyBlock2 = (
  <>
    <h3 className="vads-u-font-size--h4">
      Could applying again change VA’s decision?
    </h3>
    <p>
      <strong>
        A new application most likely won’t change our decision on your
        eligibility.
      </strong>{' '}
      If you’d like to talk about your options, please {callOurTeam}.
    </p>
    <p>
      We only recommend applying again if you’ve already worked with our
      enrollment case management team, and they’ve advised you to reapply.
    </p>
  </>
);

const reapplyBlock3 = (
  <>
    <h3 className="vads-u-font-size--h4">
      Could applying again change VA’s decision?
    </h3>
    <p>
      <strong>
        Only if you’ve had a change in your life since you last applied that may
        make you eligible for VA health care now—like receiving a VA rating for
        a service-connected disability or experiencing a decrease in your
        income.
      </strong>{' '}
      If you’d like to talk about your options, please {callOurTeam}.
    </p>
    <p>
      We only recommend applying again if you’ve already worked with our
      enrollment case management team, and they’ve advised you to reapply.
    </p>
  </>
);

const reapplyBlock4 = (
  <>
    <h3 className="vads-u-font-size--h4">Can I apply again?</h3>
    <p>
      Yes. If you have questions about how to complete your application, please{' '}
      {callOurTeam}.
    </p>
  </>
);

const reapplyBlock5 = (
  <>
    <h3 className="vads-u-font-size--h4">
      Should I just submit a new application with all my information?
    </h3>
    <p>
      <strong>
        No. We’re in the process of reviewing your current application, and
        submitting a new application won’t affect our decision.
      </strong>{' '}
      To get help providing the information we need to complete our review,
      please {callOurTeam}.
    </p>
    <p>
      We only recommend applying again if you’ve already worked with our
      enrollment case management team, and they’ve advised you to reapply.
    </p>
  </>
);

const reapplyBlock6 = (
  <>
    <h3 className="vads-u-font-size--h4">Should I apply again?</h3>
    <p>
      <strong>
        No. We’re in the process of reviewing your current application, and
        submitting a new application won’t affect our decision.
      </strong>{' '}
      If you’d like to talk about your current application, please {callOurTeam}
      .
    </p>
    <p>
      We only recommend applying again if you’ve already worked with our
      enrollment case management team, and they’ve advised you to reapply.
    </p>
  </>
);

// Export blocks
export default {
  reapplyBlock1,
  reapplyBlock2,
  reapplyBlock3,
  reapplyBlock4,
  reapplyBlock5,
  reapplyBlock6,
};
