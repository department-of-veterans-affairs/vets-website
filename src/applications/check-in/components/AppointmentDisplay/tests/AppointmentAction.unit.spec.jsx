import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import MockDate from 'mockdate';
import AppointmentAction from '../AppointmentAction';

import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import { ELIGIBILITY } from '../../../utils/appointment/eligibility';

describe('check-in', () => {
  afterEach(() => {
    MockDate.reset();
  });

  describe('AppointmentAction', () => {
    it('should render the check in button for ELIGIBLE appointments status', () => {
      const action = render(
        <CheckInProvider>
          <AppointmentAction
            appointment={{
              eligibility: ELIGIBILITY.ELIGIBLE,
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
      expect(action.getByTestId('check-in-button')).to.have.text(
        'Check in now',
      );
    });

    it('should render the check in button for appointments with ELIGIBLE status that expire in more than 10 seconds', () => {
      MockDate.set('2018-01-01T12:14:49-04:00');
      const action = render(
        <CheckInProvider>
          <AppointmentAction
            appointment={{
              checkInWindowEnd: '2018-01-01T12:15:00-04:00',
              eligibility: ELIGIBILITY.ELIGIBLE,
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
      expect(action.getByTestId('check-in-button')).to.have.text(
        'Check in now',
      );
    });
    it('should render the check in button for appointments with ELIGIBLE status in an earlier timezone', () => {
      MockDate.set('2018-01-01T13:25:00-04:00');
      const action = render(
        <CheckInProvider>
          <AppointmentAction
            appointment={{
              checkInWindowEnd: '2018-01-01T12:45:00.106-05:00',
              eligibility: ELIGIBILITY.ELIGIBLE,
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
      expect(action.getByTestId('check-in-button')).to.have.text(
        'Check in now',
      );
    });
  });
});
