import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as recordEventModule from '~/platform/monitoring/record-event';
import { AUTH_EVENTS } from '~/platform/user/authentication/constants';
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
    });
  });

  context('when the `verify` button is clicked', () => {
    it('should call recordEvent with correct argument', () => {
      const recordEventStub = sinon.stub(recordEventModule, 'default');
      const { container } = render(<IdentityVerificationAlert />);
      const selector = container.querySelector('.usa-button');
      fireEvent.click(selector);
      expect(recordEventStub.calledWith({ event: AUTH_EVENTS.VERIFY })).to.be
        .true;
      recordEventStub.restore();
    });
  });
});
