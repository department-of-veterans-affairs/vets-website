import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import WhatWeCollect from '../../../../shared/components/Disclaimer/WhatWeCollect';

describe('WhatWeCollect', () => {
  describe('WhatWeCollect', () => {
    it('should have header, collection information and privacy policy link', () => {
      const { container } = render(<WhatWeCollect />);

      const header = $('h4', container);
      const text = $$('p', container);
      const listItems = $$('li', container);
      const privacyPolicyLink = $('a[href="/privacy-policy/"]', container);

      expect(header).to.exist;
      expect(header.textContent).to.equal(
        'What information we collect when you use the chatbot',
      );

      expect(text).to.exist;
      expect(text[0].textContent).to.equal(
        'We use certain information you’ve provided to build better tools for Veterans, service members, and their families.',
      );
      expect(text[1].textContent).to.equal(
        'We keep only this information when you use our chatbot:',
      );
      expect(text[2].textContent).to.equal(
        'We protect your privacy in these ways:',
      );
      expect(text[3].textContent).to.equal(
        'Note: You can help us protect your privacy and security by not typing any personal information into our chatbot. This includes your name, address, or anything else that someone could use to identify you.',
      );

      expect(listItems).to.exist;
      expect(listItems[0].textContent).to.equal('A record of what you typed');
      expect(listItems[1].textContent).to.equal(
        'Your answers to our survey questions',
      );
      expect(listItems[2].textContent).to.equal(
        'How long you used our chatbot, the links you clicked on, and other data',
      );
      expect(listItems[3].textContent).to.equal(
        'We don’t collect any information that can be used to identify you.',
      );
      expect(listItems[4].textContent).to.equal(
        'We don’t use your information to contact you.',
      );
      expect(listItems[5].textContent).to.equal(
        'We combine your information with others as a summary to study for ideas to improve our chatbot tool.',
      );
      expect(listItems[6].textContent).to.equal(
        'We don’t share any of the information we collect outside of VA.',
      );

      expect(privacyPolicyLink).to.exist;
      expect(privacyPolicyLink.textContent).to.equal(
        'Learn more about how we collect, store, and use your information',
      );
    });
  });
});
