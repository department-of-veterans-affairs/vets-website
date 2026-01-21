import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import BeforeYouStart from '../../../../shared/components/Disclaimer/BeforeYouStart';

describe('BeforeYouStart', () => {
  describe('BeforeYouStart', () => {
    it('should have header and before you start text', () => {
      const { container } = render(<BeforeYouStart />);

      const header = $('h2', container);
      const text = $('p', container);

      expect(header).to.exist;
      expect(header.textContent).to.equal('Before you start');

      expect(text).to.exist;
      expect(text.textContent).to.equal(
        'If you think your life or health is in danger, go to the nearest emergency room or call 911. If you’re not sure if your condition is an emergency, contact your primary care provider. Find your nearest VA health facility Learn more about emergency medical care at VA',
      );
    });
  });
});
