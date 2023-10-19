import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function Disclaimer() {
  return (
    <>
      <va-breadcrumbs label="Breadcrumb">
        <a href="/">Home</a>
        <a href="/contact-us">Contact us</a>
        <a href="/contact-us/virtual-agent">VA chatbot</a>
      </va-breadcrumbs>

      <h1>VA chatbot</h1>

      <div className="va-introtext">
        <p>Use our chatbot to find information on VA.gov. </p>
      </div>

      <h2>We’re currently in beta testing</h2>
      <p>
        Welcome to our chatbot, a new part of{' '}
        <a href="https://va.gov/">VA.gov</a>. We're still building the bot's
        ability to respond to your questions, so it won't have answers to every
        question.
      </p>
      <p>
        <b>
          If you have questions about VA benefits and services that our chatbot
          can’t answer right now,{' '}
        </b>
        you can get the information in any of these ways:
        <ul>
          <li>
            <a href="/resources/helpful-va-phone-numbers/">
              Call us at one of our helpful VA phone numbers
            </a>
          </li>
          <li>
            <a href="https://ask.va.gov/">Contact us online through Ask VA</a>
          </li>
          <li>
            <a href="/resources/">Explore our resources and support content</a>
          </li>
        </ul>
      </p>

      <h2>Before you start</h2>

      <p>
        <b>If you think your life or health is in danger, </b>
        go to the nearest emergency room or call 911. If you’re not sure if your
        condition is an emergency, contact your primary care provider.
        <br />{' '}
        <a href="/find-locations">Find your nearest VA health facility</a>
        <br />{' '}
        <a href="/initiatives/emergency-room-911-or-urgent-care/">
          Learn more about emergency medical care at VA
        </a>
      </p>

      <va-additional-info
        trigger="How to get help if you’re in crisis and need to talk with someone right
        away"
      >
        <p>
          If you’re a Veteran in crisis or concerned about one, connect with our
          caring, qualified Veterans Crisis Line responders for confidential
          help. Many of them are Veterans themselves. This service is private,
          free, and available 24/7.
        </p>
        <p>
          To connect with a Veterans Crisis Line responder anytime day or night:
          <ul>
            <li>
              Dialing <va-telephone contact="988" /> and press 1.
            </li>
            <li>
              Calling <va-telephone contact="8002738255" /> and press 1.
            </li>
            <li>
              Texting <va-telephone contact="838255" />.
            </li>
            <li>
              If you have hearing loss, call{' '}
              <va-telephone
                contact={CONTACTS.SUICIDE_PREVENTION_LIFELINE}
                tty
              />
              .
            </li>
          </ul>
        </p>
      </va-additional-info>

      <h3>More about our chatbot</h3>

      <va-accordion>
        <va-accordion-item>
          <h4 slot="headline">What to expect when using our chatbot</h4>
          <p>
            Our chatbot is a resource to help you quickly find information about
            VA benefits and services. You won’t communicate with an actual
            representative through the chatbot. If you need help with any of the
            issues listed here, you’ll need to speak with a health care
            professional or one of our representatives. You can also visit our
            resources and support section for more information.
          </p>
          <p>
            <b>Our chatbot can’t do any of these things:</b>
          </p>
          <p>
            <ul>
              <li>
                {' '}
                Determine if you have a medical or mental health condition{' '}
              </li>
              <li>
                {' '}
                Provide medical or mental health advice, treatment, or
                counseling{' '}
              </li>
              <li>
                {' '}
                Answer questions or take reports about your prescriptions or
                side effects{' '}
              </li>
              <li>
                {' '}
                Help you with a personal, medical, or mental health emergency{' '}
              </li>
              <li>
                {' '}
                Transfer you directly to one of our call center representatives{' '}
              </li>
              <li> Help you sign in to VA.gov </li>
            </ul>
          </p>
          <p>
            &ensp;
            <a href="/resources/helpful-va-phone-numbers/">
              Call us at one of our helpful VA phone numbers to speak to a
              representative
            </a>
            <br />
            &ensp;
            <a href="/resources/signing-in-to-vagov/">
              Learn how to sign in to VA.gov
            </a>
          </p>
        </va-accordion-item>

        <va-accordion-item>
          <h4 slot="headline">How to use our chatbot with a screen reader</h4>
          <p>
            If you’re blind or have low vision, follow these steps to use our
            chatbot on a desktop computer with a screen reader:
          </p>
          <p>
            <ol>
              <li>
                Press <b>Tab</b> until the "Start chat" button is in focus and
                press <b>Enter</b>.
              </li>
              <li>Use the arrow keys to listen to the chatbot messages.</li>
              <li>
                Press <b>Tab</b> to select the "Type your message" section.
              </li>
              <li>
                Ask your question and press <b>Enter</b>.
              </li>
              <li>
                Press <b>Shift+Tab</b> to go back to messages.
              </li>
              <li>Use the arrow keys to focus on a specific message.</li>
              <li>
                Press <b>Enter</b> to focus on a link.
              </li>
              <li>
                Press <b>Enter</b> to open a link. The link will open on another
                page.
              </li>
              <li>
                Press <strong>Escape</strong> to leave the current message.
              </li>
              <li>
                Press <b>Shift+Tab</b> to exit the chatbot window.
              </li>
            </ol>
          </p>
          <p>
            <b>Note:</b> We’re currently in beta testing. Thank you for your
            patience as we work to make our chatbot easier to use.
          </p>
        </va-accordion-item>

        <va-accordion-item>
          <h4 slot="headline">
            What information we collect when you use the chatbot
          </h4>
          <p>
            We use certain information you’ve provided to build better tools for
            Veterans, service members, and their families.
          </p>
          <p>
            <b>We keep only this information when you use our chatbot:</b>
            <ul>
              <li>A record of what you typed</li>
              <li>Your answers to our survey questions</li>
              <li>
                How long you used our chatbot, the links you clicked on, and
                other data
              </li>
            </ul>
          </p>
          <p>
            <b>We protect your privacy in these ways:</b>
            <ul>
              <li>
                We don’t collect any information that can be used to identify
                you.
              </li>
              <li>We don’t use your information to contact you.</li>
              <li>
                We combine your information with others as a summary to study
                for ideas to improve our chatbot tool.
              </li>
              <li>
                We don’t share any of the information we collect outside of VA.
              </li>
            </ul>
          </p>
          <p>
            <b>Note:</b> You can help us protect your privacy and security by
            not typing any personal information into our chatbot. This includes
            your name, address, or anything else that someone could use to
            identify you.
          </p>
          <p>
            <a href="/privacy-policy/">
              Learn more about how we collect, store, and use your information
            </a>
          </p>
        </va-accordion-item>
      </va-accordion>
    </>
  );
}
