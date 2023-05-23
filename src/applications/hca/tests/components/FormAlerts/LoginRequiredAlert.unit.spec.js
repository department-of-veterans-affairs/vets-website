import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import LoginRequiredAlert from '../../../components/FormAlerts/LoginRequiredAlert';

describe('hca <LoginRequiredAlert>', () => {
  it('should render', () => {
    const view = render(<LoginRequiredAlert />);
    const selector = view.container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.text(
      'Please sign in to review your information',
    );
  });

  it('should render sign in button', () => {
    const view = render(<LoginRequiredAlert />);
    const selector = view.container.querySelector('va-button');
    expect(selector).to.exist;
  });

  it('should fire event when sign in button is clicked', () => {
    const props = { handleLogin: sinon.spy() };
    const view = render(<LoginRequiredAlert {...props} />);
    fireEvent.click(view.container.querySelector('va-button'));
    expect(props.handleLogin.called).to.be.true;
  });
});
