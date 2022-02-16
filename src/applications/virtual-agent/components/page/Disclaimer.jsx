import React from 'react';

export default function Disclaimer() {
  return (
    <>
      <h1>VA Virtual Agent</h1>

      <p>
        Use our virtual agent (chatbot) to get answers to your questions about
        VA benefits and services, and helpful links to find more information on
        our site.{' '}
      </p>

      <va-alert status="info">
        <h2 slot="headline">We’re currently in beta testing</h2>
        <p>
          Welcome to our virtual agent, a new part of VA.gov. We’re still
          building the virtual agent’s ability to respond to your questions, so
          it won’t have answers to every question. The agent also may be slow to
          respond. We’re adding more answers in the weeks and months ahead, so
          please check back often.
        </p>
        <p>
          <b>
            If you have questions about VA benefits and services that our
            virtual agent can’t answer right now,
          </b>
           you can get the information in any of these 3 ways:
          <ul>
            <li>
              <a href="/resources/helpful-va-phone-numbers/">
                Call us at one of our helpful VA phone numbers
              </a>
            </li>
            <li>
              <a href="https://ask.va.gov/">Contact us online through Ask VA</a>
            </li>
            <li>
              <a href="/resources/">
                Explore our resources and support content
              </a>
            </li>
          </ul>
        </p>
      </va-alert>

      <h2>Before you start</h2>

      <p>
        <b>If you think your life or health is in danger,</b>
         go to the nearest emergency room or call 911. If you’re not sure if
        your condition is an emergency, contact your primary care provider.
        <br />{' '}
        <a href="/find-locations">Find your nearest VA health facility</a>
        <br />{' '}
        <a href="/initiatives/emergency-room-911-or-urgent-care/">
          Learn more about emergency medical care at VA
        </a>
      </p>

      <va-alert status="info">
        <p slot="headline">
          How to get help if you’re in crisis and need to talk with someone
          right away
        </p>
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
              Call{' '}
              <a aria-label="8 0 0. 2 7 3. 8 2 5 5." href="tel:800-273-8255">
                800-273-8255
              </a>
              , then select 1.
            </li>
            <li>
              Text{' '}
              <a aria-label="8. 3. 8. 2. 5. 5. " href="tel:838255">
                838255
              </a>
              .
            </li>
            <li>
              <a href="https://www.veteranscrisisline.net/get-help-now/chat/?account=Veterans%2520Chat">
                Start a confidential chat.
              </a>
            </li>
            <li>
              If you have hearing loss, call TTY:{' '}
              <a aria-label="8 0 0. 7 9 9. 4 8 8 9." href="tel:800-799-4889">
                800-799-4889
              </a>
              .
            </li>
          </ul>
        </p>
      </va-alert>

      <h3>More about our virtual agent</h3>

      <va-accordion>
        <va-accordion-item header="What to expect when using our virtual agent">
          <p>
            Our virtual agent is a resource to help you quickly find information
            about VA benefits and services. You won’t communicate with an actual
            representative through the chatbot. If you need help with any of the
            issues listed here, you’ll need to speak with a health care
            professional or one of our representatives. You can also visit our
            resources and support section for more information.
          </p>
          <p>
            <b>Our virtual agent can’t do any of these things:</b>
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
              Call us at one of our helpful VA phone numbers to speak to a
              representative
            </a>
            <br />
            &ensp;
            <a href="/resources/signing-in-to-vagov/">
              Learn how to sign in to VA.gov
            </a>
          </p>
        </va-accordion-item>
      </va-accordion>

      <va-accordion>
        <va-accordion-item header="How to use our virtual agent with a screen reader">
          <p>
            If you’re blind or have low vision, follow these steps to use our
            virtual agent on a desktop computer with a screen reader:
          </p>
          <p>
            <ol>
              <li>
                Click <b>Tab</b> to select the virtual agent window.
              </li>
              <li>
                Click <b>Tab</b> to select the “Accept” button and click{' '}
                <b>Enter</b>.
              </li>
              <li>
                Use the arrow keys to listen to the virtual agent messages.
              </li>
              <li>
                Click <b>Tab</b> to select the “Type your message” section.
              </li>
              <li>
                Ask your question and press <b>Enter</b>.
              </li>
              <li>
                Click <b>Shift+Tab</b> to go back to messages.
              </li>
              <li>Use the arrow keys to focus on a specific message.</li>
              <li>
                Click <b>Enter</b> to focus on a link.
              </li>
              <li>
                Click <b>Enter</b> to open a link. The link will open on another
                page.
              </li>
              <li>
                Click <b>Shift+Tab</b> to exit the virtual agent window.
              </li>
            </ol>
          </p>
          <p>
            <b>Note:</b> We’re currently in beta testing. Thank you for your
            patience as we work to make our virtual agent easier to use.
          </p>
        </va-accordion-item>
      </va-accordion>

      <va-accordion>
        <va-accordion-item header="What information we collect when you use the virtual agent">
          <p>
            We use certain information you’ve provided to build better tools for
            Veterans, service members, and their families.
          </p>
          <p>
            <b>We keep only this information when you use our virtual agent:</b>
            <ul>
              <li>A record of what you typed</li>
              <li>Your answers to our survey questions</li>
              <li>
                How long you used our virtual agent, the links you clicked on,
                and other data
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
                for ideas to improve our virtual agent tool.
              </li>
              <li>
                We don’t share any of the information we collect outside of VA.
              </li>
            </ul>
          </p>
          <p>
            <b>Note:</b> You can help us protect your privacy and security by
            not typing any personal information into our virtual agent. This
            includes your name, address, or anything else that someone could use
            to identify you.
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
