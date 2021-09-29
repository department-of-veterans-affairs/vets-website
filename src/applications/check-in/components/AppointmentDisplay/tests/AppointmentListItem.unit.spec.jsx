import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import AppointmentListItem from '../AppointmentListItem';

describe('check-in', () => {
  describe('AppointmentListItem', () => {
    it('should render the appointment time', () => {
      const listItem = render(
        <AppointmentListItem
          appointment={{
            startTime: '2021-07-19T13:56:31',
            clinicFriendlyName: 'Green Team Clinic1',
          }}
        />,
      );

      expect(listItem.getByTestId('appointment-time')).to.exist;
      expect(listItem.getByTestId('appointment-time').innerHTML).to.match(
        /([\d]|[\d][\d]):[\d][\d]/,
      );
      expect(listItem.getByTestId('clinic-name')).to.exist;
      expect(listItem.getByTestId('clinic-name')).to.have.text(
        'Green Team Clinic1',
      );
    });
    it('passes axeCheck', () => {
      axeCheck(
        <AppointmentListItem
          appointment={{
            startTime: '2021-07-19T13:56:31',
            clinicFriendlyName: 'Green Team Clinic1',
          }}
        />,
      );
    });
  });
});
