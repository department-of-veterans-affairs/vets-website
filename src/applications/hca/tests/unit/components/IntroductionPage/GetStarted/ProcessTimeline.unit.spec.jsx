import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ProcessTimeline from '../../../../../components/IntroductionPage/GetStarted/ProcessTimeline';

describe('hca <ProcessTimeline>', () => {
  context('when the component renders', () => {
    it('should render title & `va-process-list` component', () => {
      const { container } = render(<ProcessTimeline />);
      const selectors = {
        title: container.querySelector('[data-testid="hca-timeline-heading"]'),
        list: container.querySelector('va-process-list'),
      };
      expect(selectors.list).to.exist;
      expect(selectors.title).to.exist;
    });

    it('should render correct number of process steps', () => {
      const { container } = render(<ProcessTimeline />);
      const selector = container.querySelectorAll('va-process-list-item');
      expect(selector).to.have.lengthOf(3);
    });
  });
});
