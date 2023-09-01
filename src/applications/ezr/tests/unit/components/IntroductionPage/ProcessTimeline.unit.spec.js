import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ProcessTimeline from '../../../../components/IntroductionPage/ProcessTimeline';
import content from '../../../../locales/en/content.json';

describe('ezr <ProcessTimeline>', () => {
  describe('when the component renders', () => {
    it('should render a title', () => {
      const { container } = render(<ProcessTimeline />);
      const selector = container.querySelector('h2');
      expect(selector).to.contain.text(content['intro-process-title']);
    });

    it('should render `va-process-list` component', () => {
      const { container } = render(<ProcessTimeline />);
      const selector = container.querySelector('va-process-list');
      expect(selector).to.exist;
    });

    it('should render correct number of process steps', () => {
      const { container } = render(<ProcessTimeline />);
      const selector = container.querySelectorAll('li', 'va-process-list');
      expect(selector).to.have.lengthOf(3);
    });
  });
});
