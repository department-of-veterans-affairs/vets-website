import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ProcessTimeline from '../../../../../components/IntroductionPage/GetStarted/ProcessTimeline';

describe('hca <ProcessTimeline>', () => {
<<<<<<< HEAD
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
=======
  const subject = () => {
    const { container } = render(<ProcessTimeline />);
    const selectors = () => ({
      title: container.querySelector('[data-testid="hca-timeline-heading"]'),
      vaProcessList: container.querySelector('va-process-list'),
      vaProcessListItems: container.querySelectorAll('va-process-list-item'),
    });
    return { selectors };
  };

  it('should render appropriate content', () => {
    const { selectors } = subject();
    const { title, vaProcessList, vaProcessListItems } = selectors();
    expect(title).to.exist;
    expect(vaProcessList).to.exist;
    expect(vaProcessListItems).to.have.lengthOf(3);
>>>>>>> main
  });
});
