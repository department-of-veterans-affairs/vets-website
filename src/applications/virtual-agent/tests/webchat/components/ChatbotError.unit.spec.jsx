import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ChatbotError from '../../../webchat/components/ChatbotError';

describe('ChatbotError', () => {
  describe('ChatbotError', () => {
    it('displays the error message', () => {
      const { container } = render(<ChatbotError />);
      expect($$('va-alert', container)).to.exist;
    });
  });
});
