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
      'You’ll need to apply and be found eligible for the VA education',
    );
    expect(list.textContent).to.contain(
      'Your current mailing address and contact information',
    );
    expect(list.textContent).to.contain('It should take about 15 minutes.');
  });
});
