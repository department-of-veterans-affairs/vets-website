import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

// Declare reusable content blocks
const callOurTeam = (
  <>
    call our enrollment case management team at{' '}
    <va-telephone contact={CONTACTS['222_VETS']} />
  </>
);

const ourHours = (
  <>
    We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
    <dfn>
      <abbr title="Eastern Time">ET</abbr>
    </dfn>
  </>
);

// Declare content blocks for export
const faqBlock1 = (
  <>
    <h3 className="vads-u-font-size--h4">
      How can I change my address, income, or other information in my VA health
      care records?
    </h3>
    <p>
      To update your information, please submit a Health Benefits Update Form
      (VA Form 10-10EZR).
    </p>
    <p>
      <va-link
        href="/health-care/update-health-information/"
        text="Find out how to submit VA Form 10-10EZR"
      />
      .
    </p>
    <p>
      Or you can update your address and other contact information in your
      VA.gov profile. This will update your information across several VA
      benefits and services.
    </p>
    <p>
      <va-link
        href="/profile/contact-information/"
        text="Go to your profile to update your address"
      />
      .
    </p>
  </>
);

const faqBlock2 = (
  <>
    <h3 className="vads-u-font-size--h4">
      What should I do if I think this information is incorrect, or if I have
      questions about my eligibility?
    </h3>
    <p>
      Please {callOurTeam}. {ourHours}.
    </p>
  </>
);

const faqBlock3 = (
  <>
    <h3 className="vads-u-font-size--h4">
      What should I do if I want to submit proof of my military service, or if I
      have questions about my eligibility?
    </h3>
    <p>
      Please {callOurTeam}. {ourHours}.
    </p>
  </>
);

const faqBlock4 = (
  <>
    <h3 className="vads-u-font-size--h4">
      Do any VA medical centers treat CHAMPVA recipients?
    </h3>
    <p>
      Yes. To learn more about VA medical centers that offer services to CHAMPVA
      recipients, or if you have any other questions, please {callOurTeam}.{' '}
      {ourHours}.
    </p>
  </>
);

const faqBlock5 = (
  <>
    <h3 className="vads-u-font-size--h4">
      What should I do if I have questions about my eligibility?
    </h3>
    <p>
      Please {callOurTeam}. {ourHours}.
    </p>
  </>
);

const faqBlock6 = (
  <>
    <h3 className="vads-u-font-size--h4">
      How do I submit this information to VA?
    </h3>
    <p>
      Please {callOurTeam} for directions on how to submit your information.{' '}
      {ourHours}.
    </p>
  </>
);

const faqBlock7 = (
  <>
    <h3 className="vads-u-font-size--h4">
      How will I know if VA needs more information from me to verify my military
      service?
    </h3>
    <p>
      If we need more information, we’ll send you a letter in the mail. If you
      have any questions, please {callOurTeam}. {ourHours}.
    </p>
  </>
);

const faqBlock8 = (
  <>
    <h3 className="vads-u-font-size--h4">Can I apply for VA health care?</h3>
    <p>
      As an active-duty service member, you can apply for VA health care if both
      of the below descriptions are true for you.
    </p>
    <p>
      <strong>Both of these must be true:</strong>
    </p>
    <ul>
      <li>You’ve received your separation orders, and</li>
      <li>You have less than a year until your separation date</li>
    </ul>
    <p>
      <strong>If you don’t meet the requirements listed above</strong>
    </p>
    <p>
      Please don’t apply at this time. We welcome you to apply once you meet
      these requirements.
    </p>
    <p>
      <strong>
        If you’ve already applied, think you’ve received this message in error,
        or have any questions
      </strong>
    </p>
    <p>
      Please {callOurTeam}. {ourHours}.
    </p>
  </>
);

const faqBlock9 = (
  <>
    <h3 className="vads-u-font-size--h4">
      What if I want to review my discharge status, or think I may qualify for
      an upgrade?
    </h3>
    <p>You can get more information on our website:</p>
    <p>
      <va-link
        href="/discharge-upgrade-instructions/"
        text="Find out who may qualify for a discharge upgrade"
      />
    </p>
    <p>
      <va-link
        href="/discharge-upgrade-instructions/#other-options"
        text="Learn more about the Character of Discharge review process"
      />
    </p>
  </>
);

const faqBlock10 = (
  <>
    <h3 className="vads-u-font-size--h4">Can I apply for VA health care?</h3>
    <p>
      The health care application on this page is only for Veterans or service
      members who have received their separation orders and are within one year
      of their separation. If you are a family member or caregiver submitting a
      health care application on behalf of a Veteran or service member, then you
      can use this tool to help get them VA health care.
    </p>
    <p>
      If you’re not helping a Veteran or service member sign up, you may be
      eligible for your own VA health care benefits.
    </p>
    <p>
      <va-link
        href="/health-care/family-caregiver-benefits/"
        text="Learn about health care for spouses, dependents, and family caregivers"
      />
    </p>
    <p>
      <strong>
        Note: If you are a Veteran or service member receiving this message in
        error, please {callOurTeam}. {ourHours}.
      </strong>
    </p>
  </>
);

const faqBlock11 = (
  <>
    <h3 className="vads-u-font-size--h4">
      Can I still get mental health care?
    </h3>
    <p>
      You may still be able to access certain mental health care services even
      if you’re not enrolled in VA health care.
    </p>
    <p>
      <va-link
        href="/health-care/health-needs-conditions/mental-health/"
        text="Learn more about getting started with VA mental health services"
      />
    </p>
  </>
);

// Export blocks
export default {
  faqBlock1,
  faqBlock2,
  faqBlock3,
  faqBlock4,
  faqBlock5,
  faqBlock6,
  faqBlock7,
  faqBlock8,
  faqBlock9,
  faqBlock10,
  faqBlock11,
};
