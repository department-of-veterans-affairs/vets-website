import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import VerificationPageDescription from '../../../../components/IdentityPage/VerificationPageDescription';

describe('hca <VerificationPageDescription>', () => {
  context('when the component renders', () => {
    it('should render content', () => {
      const { container } = render(<VerificationPageDescription />);
      const selectors = {
        title: container.querySelector('.schemaform-title'),
        button: container.querySelector('[data-testid="hca-login-button"]'),
      };
      expect(selectors.title).to.exist;
      expect(selectors.button).to.exist;
    });
  });

  context('when the user clicks the signin button', () => {
    it('should call the `onLogin` prop', () => {
      const props = { onLogin: sinon.spy() };
      const { container } = render(<VerificationPageDescription {...props} />);
      const selector = container.querySelector(
        '[data-testid="hca-login-button"]',
      );
      fireEvent.click(selector);
      expect(props.onLogin.called).to.be.true;
    });
  });
});
