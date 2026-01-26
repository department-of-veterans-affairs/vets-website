import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import BetaTesting from '../../../../chatbot/features/shell/components/LeftColumnContent/BetaTesting';

describe('BetaTesting', () => {
  describe('BetaTesting', () => {
    it('should have beta testing message', () => {
      const { container } = render(<BetaTesting />);

      const betaTestingText = $('h2', container);
      const questionsText = $$('p', container);
      const listItems = $$('li', container);

      expect(betaTestingText).to.exist;
      expect(betaTestingText.textContent).to.equal(
        'We’re currently in beta testing',
      );

      expect(questionsText).to.exist;
      expect(questionsText[0].textContent).to.equal(
        "Welcome to our chatbot, a new part of VA.gov. We're still building the bot's ability to respond to your questions, so it won't have answers to every question.",
      );
      expect(questionsText[1].textContent).to.equal(
        'If you have questions about VA benefits and services that our chatbot can’t answer right now, you can get the information in any of these ways:',
      );
      expect(listItems).to.exist;
      expect(listItems[0].textContent).to.equal(
        'Call us at one of our helpful VA phone numbers',
      );
      expect(listItems[1].textContent).to.equal(
        'Contact us online through Ask VA',
      );
      expect(listItems[2].textContent).to.equal(
        'Explore our resources and support content',
      );
    });
  });
});
