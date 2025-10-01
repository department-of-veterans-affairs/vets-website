import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import BetaTesting from '../../../components/Disclaimer/BetaTesting';

describe('BetaTesting', () => {
  describe('BetaTesting', () => {
    it('should have beta testing message', () => {
      const { container } = render(<BetaTesting />);

      const betaTestingText = $('h2', container);
      const questionsText = $$('p', container);

      expect(betaTestingText).to.exist;
      expect(betaTestingText.textContent).to.equal(
        'We’re currently in beta testing',
      );

      expect(questionsText).to.exist;
      expect(questionsText[0].textContent).to.equal(
        "Welcome to our chatbot, a new part of VA.gov. We're still building the bot's ability to respond to your questions, so it won't have answers to every question.",
      );
      expect(questionsText[1].textContent).to.equal(
        'If you’re a Veteran in crisis or concerned about one, connect with our caring, qualified Veterans Crisis Line responders for confidential help. Many of them are Veterans themselves. This service is private, free, and available 24/7.',
      );

      expect(questionsText[2].textContent).to.equal(
        'To connect with a Veterans Crisis Line responder anytime day or night:',
      );

      expect(questionsText[3].textContent).to.equal(
        'If you have questions about VA benefits and services that our chatbot can’t answer right now, you can get the information in any of these ways:',
      );
    });
  });
});
