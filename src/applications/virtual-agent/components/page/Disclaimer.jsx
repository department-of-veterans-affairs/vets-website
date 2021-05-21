import React from 'react';

export default function Disclaimer() {
  return (
    <>
      <h1>Welcome to the VA.gov chatbot study</h1>

      <p>Thank you for being part of this study. We appreciate your time.</p>

      <h2>Why we’re doing this study</h2>

      <p>
        We want to explore how a chatbot (or “virtual agent”) can help you find
        answers on VA.gov. <br /> <br /> We created a preview of this bot for
        you to try. Your participation and feedback will help us understand if
        this chatbot is helpful. It will also help us find ways to improve the
        bot.
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
