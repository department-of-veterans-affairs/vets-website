import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ProcessTimeline from '../../../components/IntroductionPage/ProcessTimeline';

describe('CG <ProcessTimeline>', () => {
  const getSelectors = view => ({
    timeline: view.container.querySelector('va-process-list'),
    steps: view.container.querySelectorAll('va-process-list-item'),
  });

  it('should render title and process steps', () => {
    const view = render(<ProcessTimeline />);
    const selectors = getSelectors(view);
    expect(selectors.timeline).to.exist;
    expect(selectors.steps).to.have.lengthOf(3);
  });
});
