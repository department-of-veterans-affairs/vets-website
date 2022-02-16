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

      <p>
        We want to explore how a chatbot (or “virtual agent”) can help you find
        answers on VA.gov.
      </p>
      <p>
        We created a preview of this bot for you to try. Your participation and
        feedback will help us understand if this chatbot is helpful. It will
        also help us find ways to improve the bot.
      </p>

      <h2>How to take part in this study</h2>

      <p>
        To start, type any question in the <b>Type your message</b> section of
        the bot. You can type questions like these:
      </p>

      <ul>
        <li>Does VA health care cover cosmetic surgery?</li>
        <li>How do I help a Veteran who is at risk of homelessness?</li>
        <li>How do I appeal a VA decision on my claim?</li>
      </ul>

      <p>
        When you're finished, click on the link included in your recruitment
        email and tell us what you think about the chatbot.
      </p>

      <h2>What to know before you start</h2>

      <p>
        We’re still building this chatbot. So the bot may be slow to respond.
        And the bot won’t have answers to every question.
      </p>

      <p>The bot can’t do any of these things:</p>

      <ul>
        <li>Tell you if you have a medical or mental health condition</li>
        <li>
          Provide medical or mental health advice, treatment, or counseling
        </li>
        <li>
          Answer questions or take reports about prescription medicines or side
          effects
        </li>
        <li>Help you with a personal, medical, or mental health emergency</li>
        <li>Transfer you directly to a VA call center agent</li>
        <li>Help you with issues signing in to VA.gov</li>
      </ul>

      <p>
        <b>Note:</b> Please don’t enter personal information into the bot. This
        includes your name, address, or anything else that someone could use to
        identify you.
      </p>

      <va-accordion>
        <va-accordion-item header="What to know if you need help now">
          <p>
            <b>If you’re a Veteran in crisis or concerned about one,</b> call
            the Veterans Crisis Line at{' '}
            <a aria-label="8 0 0. 2 7 3. 8 2 5 5." href="tel:800-273-8255">
              800-273-8255
            </a>{' '}
            and select 1. This service is private, free, and available 24/7.
          </p>
          <p>
            <a href="https://www.mentalhealth.va.gov">
              Get more support on our VA mental health website
            </a>
          </p>
          <p>
            <b>If you think your life or health is in danger,</b> call 911 or go
            to the nearest emergency department now. If you’re not sure if your
            condition is an emergency, contact your primary care provider.
          </p>
          <a href="/find-locations">
            Find the phone number for your VA health facility
          </a>
          <p>
            <a href="https://www.va.gov/COMMUNITYCARE/programs/veterans/Emergency_Care.asp">
              Learn more about emergency medical care at VA
            </a>
          </p>
          <p>
            <b>If you have other questions about VA benefits and services,</b>{' '}
            contact us or access our online resources and support.
          </p>
          <a href="/contact-us">Contact Us</a>

          <p>
            <a href="/resources">Go to resources and support</a>
          </p>
        </va-accordion-item>
      </va-accordion>
      <va-accordion>
        <va-accordion-item header="Information we collect about you">
          <p>
            We collect certain information about your visit to VA.gov. We use
            this information to build better tools for Veterans.
          </p>
          <p>
            <b>We keep only this information about your visit:</b>
            <ul>
              <li>A record of what you type to the bot</li>
              <li>Your answers to the survey questions</li>
              <li>
                Page metrics (like how long you use the bot and which links you
                click)
              </li>
            </ul>
          </p>
          <p>
            <b>We protect your privacy in these ways:</b>
            <ul>
              <li>
                We don’t collect any information that identifies you personally.{' '}
              </li>
              <li>Won’t don’t use your information to try to contact you.</li>
              <li>
                We group your information together with other people’s
                information in a summary that we can study.{' '}
              </li>
              <li>
                We don’t share any of the information we collect publicly.
              </li>
            </ul>
            You can also help us protect your privacy and security. Don’t type
            any personal information into the bot. This includes your name,
            address, or anything else that someone could use to identify you.
          </p>

          <p>
            <a href="/privacy-policy">
              Read the VA.gov privacy policy for more information
            </a>
          </p>
        </va-accordion-item>
      </va-accordion>
    </>
  );
}
