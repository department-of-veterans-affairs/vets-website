import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ErrorConfirm from '../components/alerts/ErrorConfirm';

describe('ErrorConfirm', () => {
  it('should render a va-alert with an error status', () => {
    const { container } = render(<ErrorConfirm />);
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('visible')).to.equal('true');
    expect(alert.getAttribute('status')).to.equal('error');
  });

  it('should display the correct headline', () => {
    const { getByRole } = render(<ErrorConfirm />);
    const headline = getByRole('heading', {
      level: 2,
      name: /We couldn’t confirm your contact email/i,
    });
    expect(headline).to.exist;
  });

  it('should display the correct error message body', () => {
    const { getByText } = render(<ErrorConfirm />);
    const message = getByText(/Please try again./i);
    expect(message).to.exist;
  });
});
