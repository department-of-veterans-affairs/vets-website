import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';

import { CheckInButton } from '../CheckInButton';

describe('check-in', () => {
  describe('CheckInButton', () => {
    it('should a passed in onclick method', () => {
      const onClick = sinon.spy();
      const { getByTestId } = render(
        <CheckInProvider>
          <CheckInButton onClick={onClick} />
        </CheckInProvider>,
      );
      fireEvent.click(getByTestId('check-in-button'));
      expect(onClick.calledOnce).to.be.true;
    });
    it('onclick should display the loading message', () => {
      const onClick = sinon.spy();
      const screen = render(
        <CheckInProvider>
          <CheckInButton onClick={onClick} />
        </CheckInProvider>,
      );
      fireEvent.click(screen.getByTestId('check-in-button'));
      expect(screen.getByTestId('check-in-button-loading')).to.be.ok;
      expect(screen.getByRole('status')).to.be.ok;
    });
    it('analytics event should not be recorded when before checkin window', () => {
      const onClick = sinon.spy();
      const recordEvent = sinon.spy();
      const { getByTestId } = render(
        <CheckInProvider>
          <CheckInButton
            checkInWindowEnd={new Date(Date.now() + 60000)}
            eventRecorder={recordEvent}
            onClick={onClick}
          />
        </CheckInProvider>,
      );
      fireEvent.click(getByTestId('check-in-button'));
      expect(recordEvent.called).to.be.false;
    });
    it('analytics event should be recorded when after checkin window', () => {
      const onClick = sinon.spy();
      const recordEvent = sinon.spy();
      const { getByTestId } = render(
        <CheckInProvider>
          <CheckInButton
            checkInWindowEnd={new Date(Date.now() - 60000)}
            eventRecorder={recordEvent}
            onClick={onClick}
          />
        </CheckInProvider>,
      );
      fireEvent.click(getByTestId('check-in-button'));
      expect(recordEvent.called).to.be.true;
    });
  });
});
