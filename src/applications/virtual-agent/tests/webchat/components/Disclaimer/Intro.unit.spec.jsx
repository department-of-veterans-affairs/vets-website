import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import Intro from '../../../../chatbot/features/shell/components/LeftColumnContent/Intro';

describe('Intro', () => {
  describe('Intro', () => {
    it('should have header and welcome text', () => {
      const { container } = render(<Intro />);

      const header = $('h1', container);
      const text = $('p', container);

      expect(header).to.exist;
      expect(header.textContent).to.equal('VA chatbot');

      expect(text).to.exist;
      expect(text.textContent).to.equal(
        'Use our chatbot to find information on VA.gov.',
      );
    });
  });
});
