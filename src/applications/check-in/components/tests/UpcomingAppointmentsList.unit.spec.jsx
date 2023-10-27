import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import { multipleAppointments } from '../../tests/unit/mocks/mock-appointments';
import UpcomingAppointmentsList from '../UpcomingAppointmentsList';

describe('unified check-in experience', () => {
  describe('UpcomingAppointmentsList', () => {
    it('displays the upcoming appointments list item components separated by month year dividers', () => {
      const { getByTestId, getAllByTestId } = render(
        <CheckInProvider>
          <UpcomingAppointmentsList
            upcomingAppointments={multipleAppointments}
          />
        </CheckInProvider>,
      );
      expect(getByTestId('appointments-list-monthyear-heading')).to.exist;
      expect(getByTestId('appointment-list')).to.exist;
      expect(getAllByTestId('appointment-list-item').length).to.equal(3);
    });
    it('displays the upcoming appointments list items components with day of the week headings properly', () => {
      const { getByTestId, getAllByTestId } = render(
        <CheckInProvider>
          <UpcomingAppointmentsList
            upcomingAppointments={multipleAppointments}
          />
        </CheckInProvider>,
      );
      expect(getAllByTestId('day-label')).to.have.length(1);
      expect(getByTestId('day-label')).to.have.text('3 Mon');
    });
    it('displays the no upcoming appointments info message when there are no appointments', () => {
      const { getByTestId } = render(
        <CheckInProvider>
          <UpcomingAppointmentsList upcomingAppointments={[]} />
        </CheckInProvider>,
      );

      expect(getByTestId('no-upcoming-appointments')).to.exist;
    });
    it('should call handleDetailClick when details link is clicked', () => {
      const push = sinon.spy();
      const router = { push };
      const { getAllByTestId } = render(
        <CheckInProvider router={router}>
          <UpcomingAppointmentsList
            upcomingAppointments={multipleAppointments}
          />
        </CheckInProvider>,
      );
      const detailsLink = getAllByTestId('details-link')[0];
      fireEvent.click(detailsLink);
      sinon.assert.calledOnce(push);
    });
  });
});
