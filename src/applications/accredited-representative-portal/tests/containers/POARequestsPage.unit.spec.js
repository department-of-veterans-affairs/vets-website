import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import POARequestsPage from '../../containers/POARequestsPage';

describe('POARequestsPage', () => {
  const getPOARequestsPage = () => render(<POARequestsPage />);

  it('renders heading', () => {
    const { getByTestId } = getPOARequestsPage();
    expect(getByTestId('poa-requests-heading').textContent).to.eq(
      'Power of attorney requests',
    );
  });
});
