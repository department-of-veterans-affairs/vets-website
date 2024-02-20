import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ProcessTimeline from '../../../../../components/IntroductionPage/GetStarted/ProcessTimeline';

describe('hca <ProcessTimeline>', () => {
  context('when the component renders', () => {
    it('should render title & `va-process-list` component', () => {
      const { container } = render(<ProcessTimeline />);
      const selectors = {
        title: container.querySelector('h2'),
        list: container.querySelector('va-process-list'),
      };
      expect(selectors.list).to.exist;
      expect(selectors.title).to.exist;
      expect(selectors.title).to.contain.text(
        'Follow these steps to get started',
      );
    });

    it('should render correct number of process steps', () => {
      const { container } = render(<ProcessTimeline />);
      const selector = container.querySelector('va-process-list');
      expect(selector.children).to.have.lengthOf(3);
    });
  });
});
