import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { TrustSupplementaryFormsAlert } from '../../../components/FormAlerts';

describe('pension <TrustSupplementaryFormsAlert>', () => {
  it('should render when trusts are present', () => {
    const { container } = render(
      <TrustSupplementaryFormsAlert formData={{ trusts: [{}] }} />,
    );
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.have.attribute('status', 'info');
    expect(container.textContent).to.include('Additional documents needed');
  });

  it('should not render when trusts are empty', () => {
    const { container } = render(
      <TrustSupplementaryFormsAlert formData={{ trusts: [] }} />,
    );
    const selector = container.querySelector('va-alert');
    expect(selector).to.not.exist;
  });

  it('should not render when formData is undefined', () => {
    const { container } = render(<TrustSupplementaryFormsAlert />);
    const selector = container.querySelector('va-alert');
    expect(selector).to.not.exist;
  });
});
