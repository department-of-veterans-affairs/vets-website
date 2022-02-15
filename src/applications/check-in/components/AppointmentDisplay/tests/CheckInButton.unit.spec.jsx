import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';

import sinon from 'sinon';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import { CheckInButton } from '../CheckInButton';

import { ELIGIBILITY } from '../../../utils/appointment/eligibility';

describe('check-in', () => {
  describe('CheckInButton', () => {
    it('should pass an axe check', () => {
      axeCheck(
        <CheckInButton
          appointment={{
            eligibility: ELIGIBILITY.ELIGIBLE,
          }}
        />,
      );
    });
    it('should render with the check in text', () => {
      const { getByText } = render(<CheckInButton />);
      expect(getByText('Check in now')).to.be.ok;
    });
    it('should a passed in onclick method', () => {
      const onClick = sinon.spy();
      const { getByTestId } = render(<CheckInButton onClick={onClick} />);
      fireEvent.click(getByTestId('check-in-button'));
      expect(onClick.calledOnce).to.be.true;
    });
    it('onclick should display the loading message', () => {
      const onClick = sinon.spy();
      const { getByTestId, getByRole } = render(
        <CheckInButton onClick={onClick} />,
      );
      fireEvent.click(getByTestId('check-in-button'));
      expect(getByTestId('check-in-button')).to.be.ok;
      expect(getByRole('status')).to.have.text('Loading...');
    });
  });
});
