import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const confirmationFAQ = () => {
  return (
    <>
      <section className="hca-confirmation-faq">
        <h2>What to do if you have questions now</h2>
        <p>
          If we haven’t contacted you within a week after you submitted your
          application, please don’t apply again:
        </p>
        <ul>
          <li>
            Please call our toll-free hotline at{' '}
            <va-telephone contact={CONTACTS['222_VETS']} />. We’re here Monday
            through Friday, 8:00 a.m. to 8:00 p.m.{' '}
            <abbr title="Eastern Time">ET</abbr>.
          </li>
        </ul>
        <p className="no-print">
          <va-link
            href="/health-care/after-you-apply/"
            text="Learn more about what happens after you apply"
          />
        </p>
      </section>

      <section className="hca-confirmation-faq">
        <h2>How can I check the status of my application?</h2>
        <p>Sign in with one of these verified accounts:</p>
        <ul>
          <li>Login.gov</li>
          <li>ID.me</li>
          <li>Premium My HealtheVet</li>
          <li>Premium DS Logon</li>
        </ul>
        <p>
          Then go back to the health care application introduction page. You’ll
          find your application status at the top of the page.
        </p>
        <p className="no-print">
          <a
            href="/health-care/apply/application"
            className="vads-c-action-link--green"
          >
            Go to health care application page
          </a>
        </p>
      </section>

      <section className="hca-confirmation-faq">
        <h2>
          Can I submit other supporting documents if I answered questions about
          my military service history?
        </h2>
        <p>
          Yes. If you answered questions about your military service history and
          may have had exposure to any toxins or other hazards while you were
          deployed or during active duty training or service, you can also send
          us a written statement with more information by mail.
        </p>
        <p>
          It’s your choice whether you want to submit a written statement. We’ll
          use the information to confirm your military service history.
        </p>
        <p>Here’s what you can include in your written statement:</p>
        <ul>
          <li>Any toxins or hazards you were exposed to</li>
          <li>Month and year when you were exposed</li>
          <li>
            Type of activity or work you were doing when you were exposed (like
            basic training)
          </li>
        </ul>
        <p>
          And you’ll need to write your name and Social Security number on your
          statement.
        </p>
        <p>Mail your documents here:</p>
        <p className="va-address-block">
          Health Eligibility Center
          <br role="presentation" />
          PO Box 5207
          <br role="presentation" />
          Janesville, WI 53547-5207
        </p>
      </section>

      <section className="hca-confirmation-faq">
        <h2>How will I know if I’m enrolled in VA health care?</h2>
        <p>
          If enrolled, you’ll receive a Veterans Health Benefits Handbook in the
          mail within about 10 days.
        </p>
        <p>
          We’ll also call to welcome you to the VA health care program, help you
          with scheduling your first appointment, and answer any questions you
          may have about your health care benefits.
        </p>
        <p className="no-print">
          <va-link
            href="/health-care/after-you-apply/"
            text="Learn more about what happens after you apply"
          />
        </p>
      </section>
    </>
  );
};

export default confirmationFAQ;
