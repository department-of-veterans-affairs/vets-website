import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import POARequestDetails from '../../../containers/POARequestDetails';

describe('render POA request details page', () => {
  const getPOARequestDetailsPage = () => render(<POARequestDetails />);

  it('renders heading', () => {
    const { getByTestId } = getPOARequestDetailsPage();
    expect(getByTestId('poa-request-details-header').textContent).to.eq(
      'POA request:',
    );
  });
});
