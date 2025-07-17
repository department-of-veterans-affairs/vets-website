import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import Verify from '../../../components/messages/Verify';

describe('Verify', () => {
  it('should render VaAlertSignIn with a null variant when no props are passed', () => {
    const { container } = render(<Verify />);
    const alert = container.querySelector('va-alert-sign-in');
    expect(alert).to.exist;
    expect(alert.getAttribute('variant')).to.be.null;
  });
});
