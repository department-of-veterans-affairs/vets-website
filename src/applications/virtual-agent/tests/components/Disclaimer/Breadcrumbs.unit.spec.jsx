import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import Breadcrumbs from '../../../components/Disclaimer/Breadcrumbs';

describe('Breadcrumbs', () => {
  describe('Breadcrumbs', () => {
    it('should have Home, Contact us, and VA chatbot links', () => {
      const { container } = render(<Breadcrumbs />);

      const home = $('a[href="/"]', container);
      const contactUs = $('a[href="/contact-us"]', container);
      const virtualAgent = $('a[href="/contact-us/virtual-agent"]', container);

      expect(home).to.exist;
      expect(home.textContent).to.equal('Home');
      expect(contactUs).to.exist;
      expect(contactUs.textContent).to.equal('Contact us');
      expect(virtualAgent).to.exist;
      expect(virtualAgent.textContent).to.equal('VA chatbot');
    });
  });
});
