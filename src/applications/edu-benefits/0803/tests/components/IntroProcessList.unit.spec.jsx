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
      'need to have applied for at least one of these VA education benefits',
    );
    expect(list.textContent).to.contain(
      'Your social security number or VA file number along with payee',
    );
    expect(list.textContent).to.contain('It should take about 15 minutes.');
  });
});
