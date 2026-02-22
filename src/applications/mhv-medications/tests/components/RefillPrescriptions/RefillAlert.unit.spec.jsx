import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import RefillAlert from '../../../components/RefillPrescriptions/RefillAlert';

describe('RefillAlert component', () => {
  const defaultConfig = {
    id: 'refill-alert',
    testId: 'refill-alert',
    status: 'info',
    className: 'refill-alert',
    title: 'Refill Alert',
  };

  it('renders without errors', () => {
    const { getByTestId } = render(
      <RefillAlert config={defaultConfig}>
        <p>content</p>
      </RefillAlert>,
    );
    expect(getByTestId('refill-alert')).to.exist;
  });

  it('renders the title', () => {
    const { getByTestId } = render(
      <RefillAlert config={defaultConfig}>
        <p>content</p>
      </RefillAlert>,
    );
    expect(getByTestId('refill-alert-title').textContent).to.equal(
      'Refill Alert',
    );
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <RefillAlert config={defaultConfig}>
        <div>Test Child</div>
      </RefillAlert>,
    );
    expect(getByText('Test Child')).to.exist;
  });
});
