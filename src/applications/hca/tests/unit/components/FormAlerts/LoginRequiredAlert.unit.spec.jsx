import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import LoginRequiredAlert from '../../../../components/FormAlerts/LoginRequiredAlert';

describe('hca <LoginRequiredAlert>', () => {
  context('when the component renders', () => {
    it('should render `va-alert` with status of `error`', () => {
      const { container } = render(<LoginRequiredAlert />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'error');
    });

    it('should render sign in button', () => {
      const { container } = render(<LoginRequiredAlert />);
      const selector = container.querySelector('va-button');
      expect(selector).to.exist;
    });
  });

  context('when the sign in button is clicked', () => {
    it('should fire the `handleLogin` spy', () => {
      const props = { handleLogin: sinon.spy() };
      const { container } = render(<LoginRequiredAlert {...props} />);
      fireEvent.click(container.querySelector('va-button'));
      expect(props.handleLogin.called).to.be.true;
    });
  });
});
