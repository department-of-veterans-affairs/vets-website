import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import AppointmentLocation from '../AppointmentLocation';

describe('check-in', () => {
  describe('AppointmentLocation', () => {
    it('Renders the name - clinic friendly name ', () => {
      const appointment = { clinicFriendlyName: 'foo' };
      const display = render(<AppointmentLocation appointment={appointment} />);

      expect(display.getByText('foo')).to.exist;
    });
    it('Renders the name - clinic name ', () => {
      const appointment = { clinicName: 'foo' };
      const display = render(<AppointmentLocation appointment={appointment} />);

      expect(display.getByText('foo')).to.exist;
    });
    it('Renders the name - prioritizes clinic friendly name ', () => {
      const appointment = {
        facility: 'not this one either',
        clinicName: 'not this',
        clinicFriendlyName: 'should be this',
      };
      const display = render(<AppointmentLocation appointment={appointment} />);

      expect(display.getByText('should be this')).to.exist;
    });
    it('Renders the name - prioritizes clinic name ', () => {
      const appointment = {
        facility: 'not this one either',
        clinicName: 'should be this',
        clinicFriendlyName: undefined,
      };
      const display = render(<AppointmentLocation appointment={appointment} />);

      expect(display.getByText('should be this')).to.exist;
    });

    it('Renders the name - falls to clinicName ', () => {
      const appointment = {
        facility: undefined,
        clinicName: 'should be this',
        clinicFriendlyName: undefined,
      };
      const display = render(<AppointmentLocation appointment={appointment} />);

      expect(display.getByText('should be this')).to.exist;
    });

    it('Renders name boldly', () => {
      const appointment = { clinicFriendlyName: 'foo' };
      const display = render(
        <AppointmentLocation appointment={appointment} bold />,
      );

      expect(display.getByText('foo')).to.exist;
      expect(
        display.getByText('foo').classList.contains('vads-u-font-weight--bold'),
      ).to.be.true;
    });
    it('Renders name not  boldly', () => {
      const appointment = { clinicFriendlyName: 'foo' };
      const display = render(<AppointmentLocation appointment={appointment} />);

      expect(display.getByText('foo')).to.exist;
      expect(
        display.getByText('foo').classList.contains('vads-u-font-weight--bold'),
      ).to.be.false;
    });
  });
});
