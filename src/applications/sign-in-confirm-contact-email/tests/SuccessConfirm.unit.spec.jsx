import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import SuccessConfirm from '../components/alerts/SuccessConfirm';

describe('SuccessConfirm', () => {
  it('should render a va-alert with a success status', () => {
    const { container } = render(<SuccessConfirm />);
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('visible')).to.equal('true');
    expect(alert.getAttribute('status')).to.equal('success');
  });

  it('should display the correct headline', () => {
    const { getByRole } = render(<SuccessConfirm />);
    const headline = getByRole('heading', {
      level: 2,
      name: /Thank you for confirming your contact email address/i,
    });
    expect(headline).to.exist;
  });

  it('should display the correct error message body', () => {
    const { getByText } = render(<SuccessConfirm />);
    const message = getByText(
      /You can update the email address we have on file for you at any time in your VA.gov profile./i,
    );
    expect(message).to.exist;
  });
});
