import React from 'react';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { useSelector } from 'react-redux';
import FeedbackEmail from './shared/FeedbackEmail';
import { openCrisisModal } from '../util/helpers';
import CrisisLineConnectButton from './CrisisLineConnectButton';

const FrequentlyAskedQuestions = ({ prefLink }) => {
  const mhvSecureMessagingToPhase1 = useSelector(
    state =>
      state.featureToggles[FEATURE_FLAG_NAMES.mhvSecureMessagingToPhase1],
  );
  const isPilot = useSelector(state => state.sm.app.isPilot);

  return mhvSecureMessagingToPhase1 ? (
    <div className="secure-messaging-faq">
      <h2 className="vads-u-margin-top--1">
        Questions about this messaging tool
      </h2>
      <va-accordion open-single bordered>
        <va-accordion-item data-testid="faq-accordion-item">
          <h3 slot="headline">Who can I send messages to?</h3>
          <p>
            You can send messages to VA providers and staff on your care team.
            Most VA providers use this tool—but some don’t. Ask your care team
            if sending messages is the best way to communicate with them.
          </p>

          <p>
            You can’t use this tool with community care providers or other
            non-VA providers.
          </p>

          <h4>Sending messages to your care team</h4>
          <p>
            When you start a new message, you’ll need to select a care team to
            send it to. Your list of care teams will depend on where you get
            care.
          </p>
          <p>
            If your care team isn’t in your list of teams to send messages to,
            contact your VA health facility and ask to speak to the My
            HealtheVet coordinator or secure messaging administrator.
          </p>

          <a href="/find-locations/">Find your nearest VA health facility</a>

          <h4>Getting replies from different providers</h4>
          <p>
            You may get a reply from the VA provider you sent a message to. Or
            you may get a reply from a different provider or staff member on
            your care team.
          </p>
          <p>
            In some cases, we may decide that a different team needs to answer
            your questions. We’ll reassign the conversation to that team so that
            they can reply to you. But only VA providers and staff will be able
            to read your messages.
          </p>
        </va-accordion-item>

        <va-accordion-item data-testid="faq-accordion-item">
          <h3 slot="headline">
            What if I have an emergency or an urgent question?
          </h3>
          <p>
            Only use messages for non-urgent needs. After you send a message, it
            can take up to 3 business days to get a reply.
          </p>
          <p>
            If you need help sooner, use one of these urgent communication
            options:
          </p>
          <ul>
            <li>
              <strong>
                If you’re in crisis or having thoughts of suicide,
              </strong>{' '}
              connect with our Veterans Crisis Line. We offer confidential
              support anytime, day or night.
            </li>

            <CrisisLineConnectButton />
          </ul>

          <ul>
            <li>
              <strong>If you think your life or health is in danger, </strong>{' '}
              call <va-telephone contact="911" /> or go to the nearest emergency
              room.
            </li>
          </ul>
        </va-accordion-item>

        <va-accordion-item data-testid="faq-accordion-item">
          <h3 slot="headline">
            Will VA protect my personal health information?
          </h3>
          <p>
            Yes. This is a secure website. We follow strict security policies
            and practices to protect your personal health information. Only you
            and your VA care team will have access to your messages.
          </p>
          <p>
            If you print or download any messages, you’ll need to take
            responsibility for protecting that information.
          </p>
        </va-accordion-item>

        <va-accordion-item data-testid="faq-accordion-item">
          <h3 slot="headline">
            What happened to my settings from My HealtheVet secure messaging?
          </h3>
          <p>
            Your notification preferences and your contact list are the same as
            they were on the My HealtheVet website.
          </p>
          <p>
            Edit your preferences on{' '}
            <a
              href={prefLink}
              target="_blank"
              rel="noreferrer"
              style={{ whiteSpace: 'nowrap' }}
            >
              My HealtheVet
            </a>
          </p>
          <p>
            Signature preferences aren’t available in this new messaging tool.
            If you have questions about your preferences, you can send us an
            email.
          </p>
          <p>
            Email us at <FeedbackEmail />
          </p>
        </va-accordion-item>

        <va-accordion-item data-testid="faq-accordion-item">
          <h3 slot="headline">
            Will I need to pay a copay for using this messaging tool?
          </h3>
          <p>
            No. You won’t pay a copay for using this messaging tool to
            communicate with your care team.
          </p>
          <p>
            If you have other health insurance, we may bill your other insurance
            provider for your care—including for the use of this messaging tool.
            But we won’t bill you for any charges not covered by your other
            insurance provider.
          </p>
          <p>
            If you have copay charges that you believe are incorrect, you can
            dispute the charges. You’ll need to dispute charges within{' '}
            <strong>30 days</strong> of receiving your copay bill.
          </p>
          <a
            href="/health-care/pay-copay-bill/dispute-charges/"
            target="_blank"
          >
            Learn how to dispute your VA copay charges
          </a>
        </va-accordion-item>
        {isPilot && (
          <va-accordion-item data-testid="faq-accordion-item">
            <h3 slot="headline">What is Secure Messaging Pilot?</h3>
            <p>TBD</p>
          </va-accordion-item>
        )}
      </va-accordion>
    </div>
  ) : (
    <div className="secure-messaging-faq">
      <h2 className="vads-u-margin-top--1">Questions about using messages</h2>

      <va-accordion open-single>
        <va-accordion-item data-testid="faq-accordion-item">
          <h3 slot="headline">Who can I communicate with in messages?</h3>
          <p>
            You can communicate with VA providers on your care team. Most VA
            providers use this tool—but some don’t. Ask your care team if
            sending messages is the best way to communicate with them.
          </p>
          <p>
            You can’t use this tool with community care providers or other
            non-VA providers.
          </p>

          <h4>Sending messages to your care team</h4>
          <p>
            When you start a new message, you’ll need to select a care team to
            send it to. Your list of care teams will depend on where you get
            care.
          </p>
          <p>
            If your care team isn’t in your list of teams to send messages to,
            contact your VA health facility. Ask to connect with the My
            HealtheVet coordinator.
          </p>
          <a href="/find-locations/">Find your nearest VA health facility</a>

          <h4>Getting replies from different providers</h4>
          <p>
            You may get a reply from your regular VA provider. Or you may get a
            reply from a different provider or staff member on your care team.
          </p>
          <p>
            In some cases, we may decide that a different team needs to answer
            your questions. We’ll reassign the conversation to that team so that
            they can reply to you. But only VA providers and staff will be able
            to read your messages.
          </p>
        </va-accordion-item>

        <va-accordion-item data-testid="faq-accordion-item">
          <h3 slot="headline">
            What if I have an emergency or an urgent question?
          </h3>
          <p>
            Only use messages for non-urgent needs. After you send a message, it
            can take up to 3 business days to get a reply.
          </p>
          <p>Here’s how to get help for urgent needs:</p>
          <ul>
            <li>
              <strong>
                If you’re in crisis or having thoughts of suicide,{' '}
              </strong>{' '}
              our Veterans Crisis Line offers confidential support anytime day
              or night.
              <br />
              <va-button
                secondary="true"
                text="Connect with the Veterans Crisis Line"
                onClick={openCrisisModal}
              />
            </li>
            <li>
              <strong>If you think your life or health is in danger, </strong>{' '}
              call <va-telephone contact="911" /> or go to the nearest emergency
              room.
            </li>
          </ul>
        </va-accordion-item>

        <va-accordion-item data-testid="faq-accordion-item">
          <h3 slot="headline">
            Will VA protect my personal health information?
          </h3>
          <p>
            Yes. This is a secure website. We follow strict security policies
            and practices to protect your personal health information. Only you
            and your VA care team will have access to your messages.
          </p>
          <p>
            If you print or download any messages, you’ll need to take
            responsibility for protecting that information.
          </p>
        </va-accordion-item>

        <va-accordion-item data-testid="faq-accordion-item">
          <h3 slot="headline">
            What happened to my settings from My HealtheVet secure messaging?
          </h3>
          <p>
            Your notification settings, contact list, and signature are the same
            as they were on the My HealtheVet website. To update them, you’ll
            need to go back to your preferences page on that site.
          </p>
          <p>
            <a href={prefLink} target="_blank" rel="noreferrer">
              Go to your settings on the My HealtheVet website
            </a>
          </p>
          <p>If you have questions, you can send us an email.</p>
          <p>
            Email us at <FeedbackEmail />
          </p>
        </va-accordion-item>
      </va-accordion>
    </div>
  );
};

export default FrequentlyAskedQuestions;
