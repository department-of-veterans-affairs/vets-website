import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import {
  multipleAppointments,
  singleAppointment,
} from '../../tests/unit/mocks/mock-appointments';
import WhatToDoNext from '../WhatToDoNext';

const mockRouter = {
  currentPage: '/health-care/appointment-check-in/appointments',
};

const mockStore = {
  app: 'dayOf',
};

const preCheckInMockStore = {
  app: 'preCheckIn',
};

describe('unified check-in experience', () => {
  describe('WhatToDoNext', () => {
    it('displays the what next header', () => {
      const { getByTestId } = render(
        <CheckInProvider store={mockStore}>
          <WhatToDoNext
            router={mockRouter}
            appointments={multipleAppointments}
          />
        </CheckInProvider>,
      );
      expect(getByTestId('what-next-header')).to.exist;
    });
    it('displays one card for a single eligible appointment', () => {
      const { getByTestId } = render(
        <CheckInProvider store={mockStore}>
          <WhatToDoNext router={mockRouter} appointments={singleAppointment} />
        </CheckInProvider>,
      );
      expect(getByTestId('what-next-card')).to.exist;
    });
    it('displays the correct card title for day of', () => {
      const initAppointments = [...singleAppointment];
      initAppointments[0] = {
        ...initAppointments[0],
        startTime: '2022-01-03T14:00:00',
      };
      const { getByTestId } = render(
        <CheckInProvider store={mockStore}>
          <WhatToDoNext router={mockRouter} appointments={initAppointments} />
        </CheckInProvider>,
      );
      expect(getByTestId('what-next-card-title')).to.exist;
      expect(getByTestId('what-next-card-title')).to.have.text(
        "It's time to check in for your 2:00 p.m. appointment",
      );
    });
    it('displays the correct card title for pre check in', () => {
      const initStore = {
        app: 'preCheckIn',
      };
      const initAppointments = [...singleAppointment];
      initAppointments[0] = {
        ...initAppointments[0],
        startTime: '2022-01-03T14:00:00',
      };
      const { getByTestId } = render(
        <CheckInProvider store={initStore}>
          <WhatToDoNext router={mockRouter} appointments={initAppointments} />
        </CheckInProvider>,
      );
      expect(getByTestId('what-next-card-title')).to.exist;
      expect(getByTestId('what-next-card-title')).to.have.text(
        'Review your contact information for your Monday, January 3 2:00 p.m. appointment',
      );
    });
    it('displays the correct card title for pre check in with multiple appointments', () => {
      const initStore = {
        app: 'preCheckIn',
      };
      const initAppointments = [...multipleAppointments];
      initAppointments[0] = {
        ...initAppointments[0],
        startTime: '2022-01-03T14:00:00',
      };
      initAppointments[1] = {
        ...initAppointments[1],
        startTime: '2022-01-03T14:30:00',
      };
      initAppointments[2] = {
        ...initAppointments[2],
        startTime: '2022-01-03T15:00:00',
      };
      const { getByTestId } = render(
        <CheckInProvider store={initStore}>
          <WhatToDoNext router={mockRouter} appointments={initAppointments} />
        </CheckInProvider>,
      );
      expect(getByTestId('what-next-card-title')).to.exist;
      expect(getByTestId('what-next-card-title')).to.have.text(
        'Review your contact information for your Monday, January 3, 2:00 p.m., Monday, January 3, 2:30 p.m. and Monday, January 3, 3:00 p.m. appointments',
      );
    });
    it('check in displays a clickable details link that calls go to details', () => {
      const goToDetailsSpy = sinon.spy();
      const { getByTestId } = render(
        <CheckInProvider store={mockStore}>
          <WhatToDoNext
            router={mockRouter}
            appointments={singleAppointment}
            goToDetails={goToDetailsSpy}
          />
        </CheckInProvider>,
      );
      const detailsLink = getByTestId('details-link-0');
      fireEvent.click(detailsLink);
      expect(goToDetailsSpy.calledOnce).to.be.true;
    });
    it('check in with multiple appointments displays a clickable details link that calls go to details', () => {
      const goToDetailsSpy = sinon.spy();
      const { getByTestId } = render(
        <CheckInProvider store={mockStore}>
          <WhatToDoNext
            router={mockRouter}
            appointments={multipleAppointments}
            goToDetails={goToDetailsSpy}
          />
        </CheckInProvider>,
      );
      const detailsLink = getByTestId('details-link-0');
      fireEvent.click(detailsLink);
      expect(goToDetailsSpy.calledOnce).to.be.true;
      const detailsLink1 = getByTestId('details-link-1');
      expect(detailsLink1).to.exist;
      const detailsLink2 = getByTestId('details-link-2');
      expect(detailsLink2).to.exist;
    });
    it('pre check in with one appointment displays a clickable details link that calls go to details', () => {
      const goToDetailsSpy = sinon.spy();
      const { getByTestId } = render(
        <CheckInProvider store={preCheckInMockStore}>
          <WhatToDoNext
            router={mockRouter}
            appointments={singleAppointment}
            goToDetails={goToDetailsSpy}
          />
        </CheckInProvider>,
      );
      const detailsLink = getByTestId('details-link-0');
      fireEvent.click(detailsLink);
      expect(goToDetailsSpy.calledOnce).to.be.true;
    });
    it('pre check in with multiple appointments does not display a clickable details link', () => {
      const goToDetailsSpy = sinon.spy();
      const { queryByTestId } = render(
        <CheckInProvider store={preCheckInMockStore}>
          <WhatToDoNext
            router={mockRouter}
            appointments={multipleAppointments}
            goToDetails={goToDetailsSpy}
          />
        </CheckInProvider>,
      );
      const detailsLink = queryByTestId('details-link-0');
      expect(detailsLink).to.not.exist;
    });
    it('displays a clickable action link that calls action', () => {
      const actionSpy = sinon.spy();
      const { getByTestId } = render(
        <CheckInProvider store={mockStore}>
          <WhatToDoNext
            router={mockRouter}
            appointments={singleAppointment}
            action={actionSpy}
          />
        </CheckInProvider>,
      );
      const actionLink = getByTestId('action-link');
      fireEvent.click(actionLink);
      expect(actionSpy.calledOnce).to.be.true;
    });
    it('displays cards for each eligible appointment', () => {
      const initAppointments = [...multipleAppointments];
      initAppointments[1] = {
        ...initAppointments[1],
        eligibility: 'INELIGIBLE',
      };
      const { getAllByTestId } = render(
        <CheckInProvider store={mockStore}>
          <WhatToDoNext router={mockRouter} appointments={initAppointments} />
        </CheckInProvider>,
      );
      expect(getAllByTestId('what-next-card')).to.exist;
      expect(getAllByTestId('what-next-card').length === 2);
    });
  });
});
