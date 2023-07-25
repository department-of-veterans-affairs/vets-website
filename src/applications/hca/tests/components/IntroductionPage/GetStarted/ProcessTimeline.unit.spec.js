import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ProcessTimeline from '../../../../components/IntroductionPage/GetStarted/ProcessTimeline';

describe('hca <ProcessTimeline>', () => {
  describe('when the component renders', () => {
    it('should render title and correct number of process steps', () => {
      const { container } = render(<ProcessTimeline />);
      const selector = container.querySelector('h2');
      expect(selector).to.contain.text('Follow these steps to get started');
    });

    it('should render correct number of process steps', () => {
      const { container } = render(<ProcessTimeline />);
      const selector = container.querySelectorAll('.process-step');
      expect(selector).to.have.lengthOf(3);
    });
  });
});
