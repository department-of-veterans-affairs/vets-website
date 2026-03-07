import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import VerificationErrorAlert from './VerificationErrorAlert';

describe('VASS Component: VerificationErrorAlert', () => {
  it('should render the verification error alert with correct structure', () => {
    const message = 'Test verification error message';
    const { getByTestId } = render(
      <VerificationErrorAlert message={message} />,
    );

    const alert = getByTestId('verification-error-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('error');
    expect(alert.getAttribute('class')).to.contain('vads-u-margin-top--4');
  });

  it('should display the provided error message', () => {
    const message =
      'The one-time verification code you entered doesn\u2019t match the one we sent you.';
    const { getByTestId } = render(
      <VerificationErrorAlert message={message} />,
    );

    const alert = getByTestId('verification-error-alert');
    expect(alert.textContent).to.contain(message);
  });

  it('should render the message inside a paragraph element', () => {
    const message = 'Account locked error message';
    const { getByTestId } = render(
      <VerificationErrorAlert message={message} />,
    );

    const paragraph = getByTestId('verification-error-alert').querySelector(
      'p',
    );
    expect(paragraph).to.exist;
    expect(paragraph.textContent).to.equal(message);
    expect(paragraph.className).to.contain('vads-u-margin-y--0');
  });
});
