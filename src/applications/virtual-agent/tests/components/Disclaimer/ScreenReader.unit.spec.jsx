import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import ScreenReader from '../../../components/Disclaimer/ScreenReader';

describe('ScreenReader', () => {
  describe('ScreenReader', () => {
    it('should have header and screen reader instructions', () => {
      const { container } = render(<ScreenReader />);

      const header = $('h4', container);
      const text = $$('p', container);

      expect(header).to.exist;
      expect(header.textContent).to.equal(
        'How to use our chatbot with a screen reader',
      );

      expect(text).to.exist;
      expect(text[0].textContent).to.equal(
        'If you’re blind or have low vision, follow these steps to use our chatbot on a desktop computer with a screen reader:',
      );
      expect(text[1].textContent).to.equal(
        'Press Tab until the "Start chat" button is in focus and press Enter.Use the arrow keys to listen to the chatbot messages.Press Tab to select the "Type your message" section.Ask your question and press Enter.Press Shift+Tab to go back to messages.Use the arrow keys to focus on a specific message.Press Enter to focus on a link.Press Enter to open a link. The link will open on another page.Press Escape to leave the current message.Press Shift+Tab to exit the chatbot window.',
      );
      expect(text[2].textContent).to.equal(
        'Note: We’re currently in beta testing. Thank you for your patience as we work to make our chatbot easier to use.',
      );
    });
  });
});
