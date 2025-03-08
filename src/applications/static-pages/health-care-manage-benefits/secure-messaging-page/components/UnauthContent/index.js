// Node modules.
import React from 'react';
// Relative imports.
import CallToActionWidget from 'applications/static-pages/cta-widget';

export const UnauthContent = () => (
  <>
    <CallToActionWidget appId="messaging" setFocus={false} headerLevel={2} />
    <h2>How can VA secure messaging help me manage my health care?</h2>
    <p>
      This web- and mobile-based service protects your sensitive information so
      you can safely and easily communicate with your VA health care team
      online.
    </p>
    <p>
      <strong>You can use secure messaging to:</strong>
    </p>
    <ul>
      <li>Ask non-urgent, non-emergency health-related questions</li>
      <li>Give your health care team updates on your condition</li>
      <li>Request VA referrals, test results, and prescription renewals</li>
      <li>Manage your VA health appointments</li>
      <li>
        Ask routine administrative questions about topics like scheduling
        appointments or getting directions
      </li>
      <li>Get health education information from the Veterans Health Library</li>
    </ul>
    <h2>Am I eligible to use secure messaging?</h2>
    <p>
      You can use this tool if you meet all of the requirements listed below.
    </p>
    <p>
      <strong>All of these must be true:</strong>
    </p>
    <ul>
      <li>
        You’re enrolled in VA health care, <strong>and</strong>
      </li>
      <li>
        You’re registered as a patient at a VA health facility,{' '}
        <strong>and</strong>
      </li>
      <li>
        Your VA health care provider has agreed to communicate with you through
        secure messaging
      </li>
    </ul>
    <p>
      <a href="/health-care/how-to-apply/">
        Find out how to apply for VA health care
      </a>
    </p>
    <h2>How does secure messaging work?</h2>
    <p>
      With secure messaging, you can write messages, save drafts, review your
      sent messages, and keep a record of your conversations.
    </p>
    <p>
      You can use this tool to communicate with any VA health care team member
      who has signed up to participate.
    </p>
    <p>
      You can send non-urgent, non-emergency messages at any time of the day or
      night. Your VA health care team should respond within 3 business days
      (Monday through Friday, 8:00 a.m. to 5:00 p.m., except federal holidays).
      If you’d like, you can set up your account to send a notification to your
      personal email when you receive a new secure message.
    </p>
    <h2>Can I use secure messaging for medical emergencies or urgent needs?</h2>
    <p>
      No. If you have an emergency or urgent need, please don’t use secure
      messaging. It may take a few days for you to get a reply.
    </p>
    <p>
      <strong>If you think you have a medical emergency,</strong> call 911 or go
      to the nearest emergency room.
    </p>
    <p>
      <strong>
        If you don’t have an emergency, but you’re not sure what type of care
        you need,
      </strong>{' '}
      call your nearest VA health facility.
    </p>
    <a href="/find-locations">Find your nearest VA health facility</a>
    <br />
    <p>
      <strong>If you need to talk with someone right away,</strong> contact the
      Veterans Crisis Line. Whatever you’re struggling with—chronic pain,
      anxiety, depression, trouble sleeping, anger, or even homelessness—we can
      support you. Our Veterans Crisis Line is confidential (private), free, and
      available 24/7.
    </p>
    <p>
      To connect with a Veterans Crisis Line responder anytime, day or night:
    </p>
    <ul>
      <li>
        Call <va-telephone contact="988" />, then select 1.
      </li>
      <li>
        Start a{' '}
        <a
          rel="noreferrer noopener"
          href="https://www.veteranscrisisline.net/get-help/chat"
        >
          confidential chat
        </a>
        .
      </li>
      <li>
        Text: <va-telephone contact="838255" sms />.
      </li>
    </ul>
    <h2>Can I use secure messaging with community (non-VA) providers?</h2>
    <p>
      No. You can communicate only with your VA providers who’ve agreed to
      participate in secure messaging.
    </p>
    <h2>Will my personal health information be protected?</h2>
    <p>
      Yes. This is a secure website. We follow strict security policies and
      practices to protect your personal health information. And only you and
      your VA health care team will have access to your secure messages.
    </p>
    <p>
      If you print or download any messages, you’ll need to take responsibility
      for protecting that information.
    </p>
    <h2>What if I have more questions?</h2>
    <p>You can:</p>
    <ul>
      <li>
        Read the{' '}
        <a
          rel="noreferrer noopener"
          href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/faqs#smGeneralFAQ"
        >
          secure messaging FAQs
        </a>{' '}
        on the My HealtheVet web portal
      </li>
      <li>
        Call the My HealtheVet help desk at{' '}
        <va-telephone contact="8773270022" /> (
        <va-telephone contact="8008778339" tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </li>
      <li>
        Or{' '}
        <a
          rel="noreferrer noopener"
          href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/contact-mhv"
        >
          contact us online
        </a>
      </li>
    </ul>
  </>
);

export default UnauthContent;
