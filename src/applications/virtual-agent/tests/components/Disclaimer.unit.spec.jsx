import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import Disclaimer from '../../components/Disclaimer';

describe('Disclaimer', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Disclaimer', () => {
    it('should render the Disclaimer component h1s', () => {
      const { container } = render(<Disclaimer />);

      const elements = $$('h1', container);
      const values = ['VA chatbot'];

      values.forEach(
        expected =>
          expect(
            elements.find(e => e.textContent === expected),
            `Could not find: \n"${expected}"`,
          ).to.exist,
      );
    });
    it('should render the Disclaimer component h2s', () => {
      const { container } = render(<Disclaimer />);

      const elements = $$('h2', container);
      const values = ['We’re currently in beta testing', 'Before you start'];

      values.forEach(
        expected =>
          expect(
            elements.find(e => e.textContent === expected),
            `Could not find: \n"${expected}"`,
          ).to.exist,
      );
    });
    it('should render the Disclaimer component h3s', () => {
      const { container } = render(<Disclaimer />);

      const elements = $$('h3', container);
      const values = ['More about our chatbot'];

      values.forEach(
        expected =>
          expect(
            elements.find(e => e.textContent === expected),
            `Could not find: \n"${expected}"`,
          ).to.exist,
      );
    });
    it('should render the Disclaimer component h4s', () => {
      const { container } = render(<Disclaimer />);

      const elements = $$('h4', container);
      const values = [
        'How to use our chatbot with a screen reader',
        'What information we collect when you use the chatbot',
        'What to expect when using our chatbot',
      ];

      values.forEach(
        expected =>
          expect(
            elements.find(e => e.textContent === expected),
            `Could not find: \n"${expected}"`,
          ).to.exist,
      );
    });
    it('should render the Disclaimer component paragraphs', () => {
      const { container } = render(<Disclaimer />);

      const elements = $$('p', container);
      const values = [
        'Use our chatbot to find information on VA.gov. ',
        "Welcome to our chatbot, a new part of VA.gov. We're still building the bot's ability to respond to your questions, so it won't have answers to every question.",
        'If you have questions about VA benefits and services that our chatbot can’t answer right now, you can get the information in any of these ways:Call us at one of our helpful VA phone numbersContact us online through Ask VAExplore our resources and support content',
        'If you think your life or health is in danger, go to the nearest emergency room or call 911. If you’re not sure if your condition is an emergency, contact your primary care provider. Find your nearest VA health facility Learn more about emergency medical care at VA',
        'If you’re a Veteran in crisis or concerned about one, connect with our caring, qualified Veterans Crisis Line responders for confidential help. Many of them are Veterans themselves. This service is private, free, and available 24/7.',
        'To connect with a Veterans Crisis Line responder anytime day or night:Dialing  and press 1.Calling  and press 1.Texting .If you have hearing loss, call .',
        'Our chatbot is a resource to help you quickly find information about VA benefits and services. You won’t communicate with an actual representative through the chatbot. If you need help with any of the issues listed here, you’ll need to speak with a health care professional or one of our representatives. You can also visit our resources and support section for more information.',
        'Our chatbot can’t do any of these things:',
        ' Determine if you have a medical or mental health condition  Provide medical or mental health advice, treatment, or counseling  Answer questions or take reports about your prescriptions or side effects  Help you with a personal, medical, or mental health emergency  Transfer you directly to one of our call center representatives  Help you sign in to VA.gov ',
        ' Call us at one of our helpful VA phone numbers to speak to a representative Learn how to sign in to VA.gov',
        'If you’re blind or have low vision, follow these steps to use our chatbot on a desktop computer with a screen reader:',
        'Press Tab until the "Start chat" button is in focus and press Enter.Use the arrow keys to listen to the chatbot messages.Press Tab to select the "Type your message" section.Ask your question and press Enter.Press Shift+Tab to go back to messages.Use the arrow keys to focus on a specific message.Press Enter to focus on a link.Press Enter to open a link. The link will open on another page.Press Escape to leave the current message.Press Shift+Tab to exit the chatbot window.',
        'Note: We’re currently in beta testing. Thank you for your patience as we work to make our chatbot easier to use.',
        'We use certain information you’ve provided to build better tools for Veterans, service members, and their families.',
        'We keep only this information when you use our chatbot:A record of what you typedYour answers to our survey questionsHow long you used our chatbot, the links you clicked on, and other data',
        'We protect your privacy in these ways:We don’t collect any information that can be used to identify you.We don’t use your information to contact you.We combine your information with others as a summary to study for ideas to improve our chatbot tool.We don’t share any of the information we collect outside of VA.',
        'Note: You can help us protect your privacy and security by not typing any personal information into our chatbot. This includes your name, address, or anything else that someone could use to identify you.',
        'Learn more about how we collect, store, and use your information',
      ];

      values.forEach(
        expected =>
          expect(
            elements.find(e => e.textContent === expected),
            `Could not find: \n"${expected}"`,
          ).to.exist,
      );
    });
  });
});
