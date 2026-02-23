import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ProcessList from '../../components/IntroProcessList';

describe('<ProcessList />', () => {
  it('should contain the correct text', () => {
    const { container } = render(<ProcessList />);

    const list = container.querySelector('va-process-list');

    expect(list).to.exist;
    expect(list.textContent).to.contain(
      'Entitlement restoration can only be granted for certain education benefits.',
    );
    expect(list.textContent).to.contain(
      'Your social security number or your VA file number',
    );
    expect(list.textContent).to.contain(
      'The request should take about 15 minutes to complete',
    );
  });
});
