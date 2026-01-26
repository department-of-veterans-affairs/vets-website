import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import WhatToExpect from '../../../../chatbot/features/shell/components/LeftColumnContent/WhatToExpect';

describe('WhatToExpect', () => {
  describe('WhatToExpect', () => {
    it('should have header, what to expect text and links', () => {
      const { container } = render(<WhatToExpect />);

      const header = $('h4', container);
      const text = $$('p', container);
      const list = $$('li', container);
      const numberLink = $(
        'a[href="/resources/helpful-va-phone-numbers/"]',
        container,
      );
      const signInLink = $(
        'a[href="/resources/signing-in-to-vagov/"]',
        container,
      );

      expect(header).to.exist;
      expect(header.textContent).to.equal(
        'What to expect when using our chatbot',
      );

      expect(text).to.exist;
      expect(text[0].textContent).to.equal(
        'Our chatbot is a resource to help you quickly find information about VA benefits and services. You won’t communicate with an actual representative through the chatbot. If you need help with any of the issues listed here, you’ll need to speak with a health care professional or one of our representatives. You can also visit our resources and support section for more information.',
      );
      expect(text[1].textContent).to.equal(
        'Our chatbot can’t do any of these things:',
      );

      expect(list).to.exist;
      expect(list[0].textContent).equal(
        'Determine if you have a medical or mental health condition',
      );
      expect(list[1].textContent).equal(
        'Provide medical or mental health advice, treatment, or counseling',
      );
      expect(list[2].textContent).equal(
        'Answer questions or take reports about your prescriptions or side effects',
      );
      expect(list[3].textContent).equal(
        'Help you with a personal, medical, or mental health emergency',
      );
      expect(list[4].textContent).equal(
        'Transfer you directly to one of our call center representatives',
      );
      expect(list[5].textContent).equal('Help you sign in to VA.gov');

      expect(numberLink).to.exist;
      expect(numberLink.textContent).to.equal(
        'Call us at one of our helpful VA phone numbers to speak to a representative',
      );

      expect(signInLink).to.exist;
      expect(signInLink.textContent).to.equal('Learn how to sign in to VA.gov');
    });
  });
});
