import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import ScreenReader from '../../../../chatbot/features/shell/components/LeftColumnContent/ScreenReader';

describe('ScreenReader', () => {
  describe('ScreenReader', () => {
    it('should have header and screen reader instructions', () => {
      const { container } = render(<ScreenReader />);

      const header = $('h4', container);
      const text = $$('p', container);
      const listItems = $$('li', container);

      expect(header).to.exist;
      expect(header.textContent).to.equal(
        'How to use our chatbot with a screen reader',
      );

      expect(text).to.exist;
      expect(text[0].textContent).to.equal(
        'If you’re blind or have low vision, follow these steps to use our chatbot on a desktop computer with a screen reader:',
      );
      expect(listItems).to.exist;
      expect(listItems[0].textContent).to.equal(
        'Press Tab until the "Start chat" button is in focus and press Enter.',
      );
      expect(listItems[1].textContent).to.equal(
        'Use the arrow keys to listen to the chatbot messages.',
      );
      expect(listItems[2].textContent).to.equal(
        'Press Tab to select the "Type your message" section.',
      );
      expect(listItems[3].textContent).to.equal(
        'Ask your question and press Enter.',
      );
      expect(listItems[4].textContent).to.equal(
        'Press Shift+Tab to go back to messages.',
      );
      expect(listItems[5].textContent).to.equal(
        'Use the arrow keys to focus on a specific message.',
      );
      expect(listItems[6].textContent).to.equal(
        'Press Enter to focus on a link.',
      );
      expect(listItems[7].textContent).to.equal(
        'Press Enter to open a link. The link will open on another page.',
      );
      expect(listItems[8].textContent).to.equal(
        'Press Escape to leave the current message.',
      );
      expect(listItems[9].textContent).to.equal(
        'Press Shift+Tab to exit the chatbot window.',
      );
      expect(text[1].textContent).to.equal(
        'Note: We’re currently in beta testing. Thank you for your patience as we work to make our chatbot easier to use.',
      );
    });
  });
});
