import React from 'react';

export default function Disclaimer() {
  return (
    <>
      <h1>About this study</h1>

      <p>
        Thank you for participating in this study. We know your time is
        valuable, and your feedback will help us build better products to serve
        you.
      </p>

      <p>
        We are exploring how a virtual agent/chatbot may help you find answers
        on Va.gov. To help us understand this, we created this prototype for you
        to test. You can try a question like “Is healthcare covered?” or ask any
        other question you like. Because this virtual agent is still in
        development (beta), it will not have answers to all your questions, and
        cannot do the following:
      </p>

      <ul>
        <li>Assess, detect, or provide a medical or mental health diagnosis</li>
        <li>
          Provide medical or mental health advice, treatment, or counseling
        </li>
        <li>Escalate an emergency</li>
        <li>Escalate directly to VA.gov support personnel</li>
        <li>Troubleshoot login issues</li>
      </ul>

      <p>
        Please do not enter personal information that someone can use to
        identify you personally.
      </p>

      <p>
        We have created a survey to help you help us build a better bot. When
        you're ready, please tell us about your experience and how we can
        improve.
      </p>

      <p>As always, we thank you for your service.</p>

      <va-accordion>
        <va-accordion-item header="If you need immediate help">
          <p>
            If you are experiencing a crisis, please call the Veterans Crisis
            Line at 800-273-8255 and press 1. To find additional support, go to{' '}
            <a href="https://www.mentalhealth.va.gov">mentalhealth.va.gov</a>.
          </p>

          <p>
            If you are experiencing a medical emergency, please call 911. If you
            are not sure if you are experiencing a medical emergency, please
            contact your primary care provider, or go to our{' '}
            <a href="/COMMUNITYCARE/programs/veterans/Emergency_Care.asp">
              Emergency Medical Care
            </a>{' '}
            page to learn more.
          </p>

          <p>
            For other VA benefits and services questions, go to the{' '}
            <a href="/contact-us">Contact Us</a> page, where you can find phone
            numbers, FAQs, step-by-step guides, and other resources.
          </p>
        </va-accordion-item>
      </va-accordion>
      <va-accordion>
        <va-accordion-item header="What information are we collecting?">
          <p>
            VA.gov automatically collects certain information about your visit
            to VA.gov web pages. We limit the data collected to meet specific
            business needs and to protect your privacy.
          </p>
          <p>
            Please know that:
            <ul>
              <li>We won't know who you are.</li>
              <li>
                We will not use this information to identify you personally.
              </li>
              <li>We will not contact you.</li>
            </ul>
          </p>
          <p>
            We will retain and analyze conversational logs (what you type to the
            bot), survey results, and page metrics to answer these types of
            questions:
            <ul>
              <li>What topics and questions are essential to Veterans?</li>
              <li>What questions did the bot answer?</li>
              <li>What questions did the bot not answer?</li>
              <li>Could this tool be helpful to Veterans? How?</li>
              <li>How many Veterans tried to use the bot?</li>
            </ul>
            Consolidated information will be aggregated, analyzed internally,
            and used to help us build better products. Findings will not be
            released publicly.
          </p>
          <p>
            During this learning phase, please help us protect your privacy and
            security by not typing any personal information, such as:
            <ul>
              <li>Your name</li>
              <li>Address</li>
              <li>Social security number</li>
            </ul>
            Or any other information that could be used to identify you.
          </p>
          <p>
            For more information on how we protect your privacy, go to our{' '}
            <a href="/privacy-policy">
              Privacy, Policies, and legal information
            </a>{' '}
            page.
          </p>
        </va-accordion-item>
      </va-accordion>
    </>
  );
}
