import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import IdentityVerificationAlert from '../../../../components/FormAlerts/IdentityVerificationAlert';

describe('hca <IdentityVerificationAlert>', () => {
  const mockState = serviceName => ({
    user: { profile: { signIn: { serviceName } } },
  });
  context('when the component renders', () => {
    it('should render `va-alert-sign-in` for ID.me', () => {
      const { container } = renderInReduxProvider(
        <IdentityVerificationAlert />,
        { initialState: mockState('idme') },
      );
      const selector = container.querySelector('va-alert-sign-in');
      expect(selector).to.exist;
      expect(selector.getAttribute('variant')).to.eql('verifyIdMe');
    });

    it('should render `va-alert-sign-in` for Login.gov', () => {
      const { container } = renderInReduxProvider(
        <IdentityVerificationAlert />,
        { initialState: mockState('logingov') },
      );
      const selector = container.querySelector('va-alert-sign-in');
      expect(selector).to.exist;
      expect(selector.getAttribute('variant')).to.eql('verifyLoginGov');
    });

    it('should render `va-alert-sign-in` with 2 buttons for MHV', () => {
      const { container } = renderInReduxProvider(
        <IdentityVerificationAlert />,
        { initialState: mockState('mhv') },
      );
      const selector = container.querySelector('va-alert-sign-in');
      expect(selector).to.exist;
      expect(selector.getAttribute('variant')).to.eql('signInEither');
      expect(selector.getAttribute('heading-level')).to.eql('2');
      expect(container.querySelectorAll('button').length).to.eql(2);
    });
  });
});
