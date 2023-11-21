import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import IdentityVerificationAlert from '../../../../components/FormAlerts/IdentityVerificationAlert';

describe('hca <IdentityVerificationAlert>', () => {
  context('when the component renders', () => {
    it('should render `va-alert` with status of `continue`', () => {
      const { container } = render(<IdentityVerificationAlert />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'continue');
    });

    it('should render `verify` button with correct href', () => {
      const { container } = render(<IdentityVerificationAlert />);
      const selector = container.querySelector('.usa-button');
      expect(selector).to.exist;
      expect(selector).to.have.attr('href', '/verify');
    });
  });

  context('when the `verify` button is clicked', () => {
    it('should trigger the `onVerify` spy', () => {
      const verifySpy = sinon.spy();
      const { container } = render(
        <IdentityVerificationAlert onVerify={verifySpy} />,
      );
      const selector = container.querySelector('.usa-button');
      fireEvent.click(selector);
      expect(verifySpy.called).to.be.true;
    });
  });
});
