import React from 'react';
import PropTypes from 'prop-types';
import CrisisLineConnectButton from './CrisisLineConnectButton';

const FrequentlyAskedQuestions = ({ prefLink }) => {
  return (
    <div className="secure-messaging-faq">
      <h2 className="vads-u-margin-top--1">
        Questions about this messaging tool
      </h2>
      <va-accordion open-single bordered>
        <va-accordion-item
          data-testid="faq-accordion-item"
          data-dd-action-name="Who can I send messages to? headline clicked"
        >
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

          <a
            href="/find-locations/"
            data-dd-action-name="Find your nearest VA health facility link in accordion"
          >
            Find your nearest VA health facility
          </a>

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

        <va-accordion-item
          data-testid="faq-accordion-item"
          data-dd-action-name="What if I have an emergency or an urgent question? headline clicked"
        >
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
              <CrisisLineConnectButton />
            </li>

            <li>
              <strong>If you think your life or health is in danger, </strong>{' '}
              call <va-telephone contact="911" data-dd-action-name="911 link" />{' '}
              or go to the nearest emergency room.
            </li>
          </ul>
        </va-accordion-item>

        <va-accordion-item
          data-testid="faq-accordion-item"
          data-dd-action-name="Will VA protect my personal health information? headline clicked"
        >
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

        <va-accordion-item
          data-testid="faq-accordion-item"
          data-dd-action-name="What happened to my settings from My HealtheVet secure messaging? headline clicked"
        >
          <h3 slot="headline">
            What happened to my settings from My HealtheVet secure messaging?
          </h3>
          <p>
            Your notifications, contact list, and signature preferences are the
            same as they were on the previous version of My HealtheVet. If you
            want to change your preferences, you’ll need to go back to that
            version.
          </p>
          <p>
            Edit your preferences on{' '}
            <a
              href={prefLink}
              target="_blank"
              rel="noreferrer"
              data-dd-action-name="My HealtheVet (opens in new tab) link in accordion"
            >
              My HealtheVet (opens in new tab)
            </a>
          </p>
          <p>
            If you have feedback or questions about your preferences, you can
            use the feedback button on this page.
          </p>
        </va-accordion-item>

        <va-accordion-item
          data-testid="faq-accordion-item"
          data-dd-action-name="Will I need to pay a copay for using this messaging tool? headline clicked"
        >
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
            data-dd-action-name="Learn how to dispute your VA copay charges link in accordion"
          >
            Learn how to dispute your VA copay charges
          </a>
        </va-accordion-item>
      </va-accordion>
    </div>
  );
};

FrequentlyAskedQuestions.propTypes = {
  prefLink: PropTypes.string,
};

export default FrequentlyAskedQuestions;
