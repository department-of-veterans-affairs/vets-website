import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ProcessTimeline from '../../../../../components/IntroductionPage/GetStarted/ProcessTimeline';

describe('hca <ProcessTimeline>', () => {
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
  });
});
