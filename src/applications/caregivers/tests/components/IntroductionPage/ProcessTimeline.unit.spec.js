import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ProcessTimeline from '../../../components/IntroductionPage/ProcessTimeline';

describe('CG <ProcessTimeline>', () => {
  const getSelectors = view => ({
    title: view.container.querySelector('h2'),
    steps: view.container.querySelectorAll('.process-step'),
  });

  it('should render title and process steps', () => {
    const view = render(<ProcessTimeline />);
    const selectors = getSelectors(view);
    expect(selectors.title).to.contain.text(
      'Follow these steps to get started:',
    );
    expect(selectors.steps).to.have.lengthOf(3);
  });
});
