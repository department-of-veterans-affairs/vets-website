import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import LoginRequiredAlert from '../../../components/FormAlerts/LoginRequiredAlert';

describe('hca <LoginRequiredAlert>', () => {
  describe('when the component renders', () => {
    it('should render `va-alert` with correct title', () => {
      const { container } = render(<LoginRequiredAlert />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.contain.text(
        'Please sign in to review your information',
      );
    });
    it('should render sign in button', () => {
      const { container } = render(<LoginRequiredAlert />);
      const selector = container.querySelector('va-button');
      expect(selector).to.exist;
    });
  });

  describe('when the sign in button is clicked', () => {
    it('should fire the `handleLogin` action', () => {
      const props = { handleLogin: sinon.spy() };
      const { container } = render(<LoginRequiredAlert {...props} />);
      fireEvent.click(container.querySelector('va-button'));
      expect(props.handleLogin.called).to.be.true;
    });
  });
});
