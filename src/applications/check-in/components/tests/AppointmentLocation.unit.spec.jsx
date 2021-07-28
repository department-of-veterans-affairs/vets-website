import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import AppointmentLocation from '../AppointmentLocation';

describe('check-in', () => {
  describe('AppointmentLocation', () => {
    it('Renders the name - clinic friendly name ', () => {
      const fakeStore = {
        getState: () => ({
          checkInData: { appointment: { clinicFriendlyName: 'foo' } },
        }),
        subscribe: () => {},
        dispatch: () => ({}),
      };
      const display = render(<AppointmentLocation store={fakeStore} />);

      expect(display.getByText('foo')).to.exist;
    });
    it('Renders the name - clinic name ', () => {
      const fakeStore = {
        getState: () => ({
          checkInData: { appointment: { clinicName: 'foo' } },
        }),
        subscribe: () => {},
        dispatch: () => ({}),
      };
      const display = render(<AppointmentLocation store={fakeStore} />);

      expect(display.getByText('foo')).to.exist;
    });
    it('Renders the name - facility name ', () => {
      const fakeStore = {
        getState: () => ({
          checkInData: { appointment: { facility: 'foo' } },
        }),
        subscribe: () => {},
        dispatch: () => ({}),
      };
      const display = render(<AppointmentLocation store={fakeStore} />);

      expect(display.getByText('foo')).to.exist;
    });
    it('Renders the name - prioritizes clinic friendly name ', () => {
      const fakeStore = {
        getState: () => ({
          checkInData: {
            appointment: {
              facility: 'not this one either',
              clinicName: 'not this',
              clinicFriendlyName: 'should be this',
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => ({}),
      };
      const display = render(<AppointmentLocation store={fakeStore} />);

      expect(display.getByText('should be this')).to.exist;
    });
    it('Renders the name - prioritizes clinic name ', () => {
      const fakeStore = {
        getState: () => ({
          checkInData: {
            appointment: {
              facility: 'not this one either',
              clinicName: 'should be this',
              clinicFriendlyName: undefined,
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => ({}),
      };
      const display = render(<AppointmentLocation store={fakeStore} />);

      expect(display.getByText('should be this')).to.exist;
    });

    it('Renders the name - falls to facility name ', () => {
      const fakeStore = {
        getState: () => ({
          checkInData: {
            appointment: {
              facility: 'should be this',
              clinicName: undefined,
              clinicFriendlyName: undefined,
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => ({}),
      };
      const display = render(<AppointmentLocation store={fakeStore} />);

      expect(display.getByText('should be this')).to.exist;
    });
  });
});
