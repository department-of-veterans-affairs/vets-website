import React from 'react';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import IdentityVerificationAlert from '../../../../components/FormAlerts/IdentityVerificationAlert';

describe('ezr <IdentityVerificationAlert>', () => {
  context('when the component renders', () => {
    it('should render `va-alert` with status of `continue`', () => {
      const { container } = renderInReduxProvider(
        <IdentityVerificationAlert />,
        {
          initialState: {
            user: { profile: { signIn: { serviceName: 'logingov' } } },
          },
        },
      );
      const selector = container.querySelector('va-alert-sign-in');
      expect(selector).to.exist;
      expect(selector).to.have.attr('variant', 'verifyLoginGov');
    });
  });
});
