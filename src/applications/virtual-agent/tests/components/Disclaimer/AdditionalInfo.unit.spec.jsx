import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import AdditionalInfo from '../../../components/Disclaimer/AdditionalInfo';

describe('AdditionalInfo', () => {
  describe('AdditionalInfo', () => {
    it('should have additional info text and va suicide prevention phone number', () => {
      const { container } = render(<AdditionalInfo />);

      const text = $$('p', container);
      const number = $$('va-telephone', container);

      expect(text).to.exist;
      expect(text[0].textContent).to.equal(
        'If you’re a Veteran in crisis or concerned about one, connect with our caring, qualified Veterans Crisis Line responders for confidential help. Many of them are Veterans themselves. This service is private, free, and available 24/7.',
      );
      expect(text[1].textContent).to.equal(
        'To connect with a Veterans Crisis Line responder anytime day or night:Dialing  and press 1.Calling  and press 1.Texting .If you have hearing loss, call .',
      );
      expect(number).to.exist;
    });
  });
});
