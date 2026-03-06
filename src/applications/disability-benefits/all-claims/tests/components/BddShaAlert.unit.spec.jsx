import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import BddShaAlert from '../../components/BddShaAlert';

describe('BddShaAlert', () => {
  const renderComponent = () => render(<BddShaAlert />);

  it('renders a va-alert with info status', () => {
    const { container } = renderComponent();
    const alert = container.querySelector('va-alert');

    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('info');
  });

  it('renders the correct headline', () => {
    const { getByText } = renderComponent();

    getByText('A Separation Health Assessment (SHA) Part A is required');
  });

  it('renders the body text explaining the SHA requirement', () => {
    const { getByText } = renderComponent();

    getByText(/If you do not include a SHA Part A/);
    getByText(/will not be able to deliver a decision within 30 days/);
  });

  it('renders a link to the supporting evidence page', () => {
    const { container } = renderComponent();
    const link = container.querySelector('va-link');

    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal(
      "Check if you've uploaded a SHA Part A document",
    );
    expect(link.getAttribute('href')).to.equal(
      '/supporting-evidence/additional-evidence',
    );
  });
});
