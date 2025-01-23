import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import IdentityVerificationAlert from '../../../../components/FormAlerts/IdentityVerificationAlert';

describe('ezr <IdentityVerificationAlert>', () => {
  context('when the component renders', () => {
    it('should render `va-alert-sign-in` with status of `verifyIdMe`', () => {
      const { container } = renderInReduxProvider(
        <IdentityVerificationAlert />,
        {
          initialState: {
            user: { profile: { signIn: { serviceName: 'idme ' } } },
          },
        },
      );
      const selector = container.querySelector('va-alert-sign-in');
      expect(selector).to.exist;
      expect(selector).to.have.attr('variant', 'verifyIdMe');
    });

    it('should render ID.me button', () => {
      const { container } = renderInReduxProvider(
        <IdentityVerificationAlert />,
        {
          initialState: {
            user: { profile: { signIn: { serviceName: 'idme ' } } },
          },
        },
      );
      const selector = container.querySelector('.idme-verify-button');
      fireEvent.click(selector);
      expect(selector).to.exist;
    });
  });
});
