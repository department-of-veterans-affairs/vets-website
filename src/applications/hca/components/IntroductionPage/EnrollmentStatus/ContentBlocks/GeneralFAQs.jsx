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
  <section className="hca-enrollment-faq" data-testid="hca-enrollment-faq-1">
    <h3>How can I update my VA health benefits information?</h3>
    <p>
      You can update your personal, financial, and insurance information on our
      Health Benefits Update Form (VA Form 10-10EZR).
    </p>
    <p>
      <va-link-action
        href={APP_URLS.ezr}
        text="Update your health benefits information"
      />
    </p>
    <p>
      You can also update some information (like your address and other contact
      information) in your VA.gov profile. This will update your information
      across certain benefits and services.
    </p>
    <p>
      <va-link
        href={`${APP_URLS.profile}/contact-information/`}
        text="Go to your VA.gov profile to update your contact information"
      />
    </p>
    <h4>About VA dental care</h4>
    <p>
      If you qualify for VA dental care benefits, you may be able to get some or
      all of your dental care through VA. Or if you don’t qualify for VA dental
      care, you can buy dental insurance at a reduced cost through the VA Dental
      Insurance Program (VADIP).
    </p>
    <p>
      <va-link
        href="/health-care/about-va-health-benefits/dental-care/dental-insurance/"
        text="Learn more about VA Dental Insurance Program (VADIP)"
      />
    </p>
    <p>
      To find out about your VA dental care benefits eligibility, call our
      Health Eligibility Center at{' '}
      <va-telephone contact={CONTACTS['222_VETS']} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). {ourHours}. You can also visit your local VA facility to learn more.
    </p>
    <p>
      <va-link
        href={APP_URLS.facilities}
        text="Find your nearest VA facility"
      />
    </p>
  </section>
);

const faqBlock2 = (
  <section className="hca-enrollment-faq" data-testid="hca-enrollment-faq-2">
    <h3>
      What should I do if I think this information is incorrect, or if I have
      questions about my eligibility?
    </h3>
    <p>
      Please {callOurTeam}. {ourHours}.
    </p>
  </section>
);

const faqBlock3 = (
  <section className="hca-enrollment-faq" data-testid="hca-enrollment-faq-3">
    <h3>
      What should I do if I want to submit proof of my military service, or if I
      have questions about my eligibility?
    </h3>
    <p>
      Please {callOurTeam}. {ourHours}.
    </p>
  </section>
);

const faqBlock4 = (
  <section className="hca-enrollment-faq" data-testid="hca-enrollment-faq-4">
    <h3>Do any VA medical centers treat CHAMPVA recipients?</h3>
    <p>
      Yes. To learn more about VA medical centers that offer services to CHAMPVA
      recipients, or if you have any other questions, please {callOurTeam}.{' '}
      {ourHours}.
    </p>
  </section>
);

const faqBlock5 = (
  <section className="hca-enrollment-faq" data-testid="hca-enrollment-faq-5">
    <h3>What should I do if I have questions about my eligibility?</h3>
    <p>
      Please {callOurTeam}. {ourHours}.
    </p>
  </section>
);

const faqBlock6 = (
  <section className="hca-enrollment-faq" data-testid="hca-enrollment-faq-6">
    <h3>How do I submit this information to VA?</h3>
    <p>
      Please {callOurTeam} for directions on how to submit your information.{' '}
      {ourHours}.
    </p>
  </section>
);

const faqBlock7 = (
  <section className="hca-enrollment-faq" data-testid="hca-enrollment-faq-7">
    <h3>
      How will I know if VA needs more information from me to verify my military
      service?
    </h3>
    <p>
      If we need more information, we’ll send you a letter in the mail. If you
      have any questions, please {callOurTeam}. {ourHours}.
    </p>
  </section>
);

const faqBlock8 = (
  <section className="hca-enrollment-faq" data-testid="hca-enrollment-faq-8">
    <h3>Can I apply for VA health care?</h3>
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
  </section>
);

const faqBlock9 = (
  <section className="hca-enrollment-faq" data-testid="hca-enrollment-faq-9">
    <h3>
      What if I want to review my discharge status, or think I may qualify for
      an upgrade?
    </h3>
    <p>You can get more information on our website:</p>
    <p>
      <va-link
        href={APP_URLS.dischargeWizard}
        text="Find out who may qualify for a discharge upgrade"
      />
    </p>
    <p>
      <va-link
        href={`${APP_URLS.dischargeWizard}/#other-options`}
        text="Learn more about the Character of Discharge review process"
      />
    </p>
  </section>
);

const faqBlock10 = (
  <section className="hca-enrollment-faq" data-testid="hca-enrollment-faq-10">
    <h3>Can I apply for VA health care?</h3>
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
      <strong>Note:</strong> If you are a Veteran or service member receiving
      this message in error, please {callOurTeam}. {ourHours}.
    </p>
  </section>
);

const faqBlock11 = (
  <section className="hca-enrollment-faq" data-testid="hca-enrollment-faq-11">
    <h3>Can I still get mental health care?</h3>
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
  </section>
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
