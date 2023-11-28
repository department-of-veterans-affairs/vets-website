import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import Welcome from '../../components/Welcome';

const setup = (props = {}) => render(<Welcome {...props} />);

describe('Welcome component', () => {
  it('renders', () => {
    const { getByRole } = setup({ name: 'Jeff' });
    expect(getByRole('heading')).to.have.text('Welcome, Jeff');
  });

  it("masks the user's name from datadog (no PII)", () => {
    const { getByText } = setup({ name: 'Jeff' });
    const result = getByText('Jeff').getAttribute('data-dd-privacy');
    expect(result).to.eq('mask');
  });

  it('renders when name is not supplied', () => {
    const { getByRole } = setup();
    expect(getByRole('heading')).to.have.text('Welcome');
  });
});
