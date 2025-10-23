import React from 'react';
import { APP_URLS } from '../../../../utils/appUrls';
import { CONTACTS } from '../../../../utils/imports';

// Declare reusable content blocks
const callOurTeam = (
  <>
    call our enrollment case management team at{' '}
    <va-telephone contact={CONTACTS['222_VETS']} />
  </>
);

// Declare content blocks for export
const reapplyBlock1 = (
  <section className="hca-enrollment-faq" data-testid="hca-reapply-faq-1">
    <h3>Will applying again update my information?</h3>
    <p>
      No. A new application won’t update your information. If you have questions
      about the information we have on record for you, please call your nearest
      VA medical center.
    </p>
    <p>
      <a className="vads-c-action-link--blue" href={APP_URLS.facilities}>
        Find your VA medical center
      </a>
    </p>
  </section>
);

const reapplyBlock2 = (
  <section className="hca-enrollment-faq" data-testid="hca-reapply-faq-2">
    <h3>Could applying again change VA’s decision?</h3>
    <p>
      A new application most likely won’t change our decision on your
      eligibility. If you’d like to talk about your options, please{' '}
      {callOurTeam}.
    </p>
  </section>
);

const reapplyBlock3 = (
  <section className="hca-enrollment-faq" data-testid="hca-reapply-faq-3">
    <h3>Could applying again change VA’s decision?</h3>
    <p>
      Only if you’ve had a change in your life since you last applied that may
      make you eligible for VA health care now—like receiving a VA rating for a
      service-connected disability or experiencing a decrease in your income. If
      you’d like to talk about your options, please {callOurTeam}.
    </p>
  </section>
);

const reapplyBlock4 = (
  <section className="hca-enrollment-faq" data-testid="hca-reapply-faq-4">
    <h3>Can I apply again?</h3>
    <p>
      Yes. If you have questions about how to complete your application, please{' '}
      {callOurTeam}.
    </p>
  </section>
);

const reapplyBlock5 = (
  <section className="hca-enrollment-faq" data-testid="hca-reapply-faq-5">
    <h3>Should I just submit a new application with all my information?</h3>
    <p>
      No. We’re in the process of reviewing your current application, and
      submitting a new application won’t affect our decision. To get help
      providing the information we need to complete our review, please{' '}
      {callOurTeam}.
    </p>
  </section>
);

const reapplyBlock6 = (
  <section className="hca-enrollment-faq" data-testid="hca-reapply-faq-6">
    <h3>Should I apply again?</h3>
    <p>
      No. We’re in the process of reviewing your current application, and
      submitting a new application won’t affect our decision. If you’d like to
      talk about your current application, please {callOurTeam}.
    </p>
  </section>
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
