import React from 'react';
import { expect } from 'chai';
import Sinon from 'sinon';
import { pageNotFoundHeading } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { AppointmentList } from './index';
import { renderWithStoreAndRouter } from '../tests/mocks/setup';
import * as AppointmentsPage from './pages/AppointmentsPage/index';
import * as ConfirmedAppointmentDetailsPage from './pages/UpcomingAppointmentsDetailsPage';
import * as RequestedAppointmentDetailsPage from './pages/RequestedAppointmentDetailsPage/RequestedAppointmentDetailsPage';

describe('VAOS Page: Appointment list routes', () => {
  const sandbox = Sinon.createSandbox();
  let ConfirmedAppointmentDetailsPageStub;
  let RequestedAppointmentDetailsPageStub;
  let AppointmentsPageStub;

  before(() => {
    // Mock the real pages since they are tested seperately.
    ConfirmedAppointmentDetailsPageStub = sandbox
      .stub(ConfirmedAppointmentDetailsPage, 'default')
      .returns(<div>Mock Page</div>);
    RequestedAppointmentDetailsPageStub = sandbox
      .stub(RequestedAppointmentDetailsPage, 'default')
      .returns(<div>Mock Page</div>);
    AppointmentsPageStub = sandbox
      .stub(AppointmentsPage, 'default')
      .returns(<div>Mock Page</div>);
  });

  after(() => {
    sandbox.restore();
  });

  describe('When route is /', () => {
    const initialState = {};

    beforeEach(() => {
      AppointmentsPageStub.resetHistory();
    });

    it('should render page for route /', async () => {
      // Arrange
      const path = '/';

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path,
      });
      await screen.findByText('Mock Page');

      // Assert
      expect(AppointmentsPageStub.firstCall.args[0].location.pathname).to.equal(
        path,
      );
    });
  });

  describe('When route is /pending', () => {
    const initialState = {};

    beforeEach(() => {
      AppointmentsPageStub.resetHistory();
    });

    it('should render page', async () => {
      // Arrange
      const path = '/pending';

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path,
      });
      await screen.findByText('Mock Page');

      // Assert
      expect(
        AppointmentsPageStub.firstCall?.args[0].location.pathname,
      ).to.equal(path);
    });
  });

  describe('When route is /pending/:id', () => {
    const initialState = {};

    beforeEach(() => {
      RequestedAppointmentDetailsPageStub.resetHistory();
    });

    it('should render page', async () => {
      // Arrange
      const path = '/pending/1';

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path,
      });
      await screen.findByText('Mock Page');

      // Assert
      expect(
        RequestedAppointmentDetailsPageStub.firstCall?.args[0].location
          .pathname,
      ).to.equal(path);
    });
  });

  describe('When route is /past', () => {
    const initialState = {};

    beforeEach(() => {
      AppointmentsPageStub.resetHistory();
    });

    it('should render page', async () => {
      // Arrange
      const path = '/past';

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path,
      });
      await screen.findByText('Mock Page');

      // Assert
      expect(
        AppointmentsPageStub.firstCall?.args[0].location.pathname,
      ).to.equal(path);
    });
  });

  describe('When route is /past/:id', () => {
    const initialState = {};

    beforeEach(() => {
      ConfirmedAppointmentDetailsPageStub.resetHistory();
    });

    it('should render page', async () => {
      // Arrange
      const path = '/past/1';

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path,
      });
      await screen.findByText('Mock Page');

      // Assert
      expect(
        ConfirmedAppointmentDetailsPageStub.firstCall?.args[0].location
          .pathname,
      ).to.equal(path);
    });
  });

  describe('When route is /:id', () => {
    const initialState = {};

    beforeEach(() => {
      ConfirmedAppointmentDetailsPageStub.resetHistory();
    });

    it('should render page', async () => {
      // Arrange
      const path = '/1';

      // Act
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path,
      });
      await screen.findByText('Mock Page');

      // Assert
      expect(
        ConfirmedAppointmentDetailsPageStub.firstCall?.args[0].location
          .pathname,
      ).to.equal(path);
    });
  });

  describe('When route is /unknown/path', () => {
    const initialState = {};

    it('should display 404 page', async () => {
      // Given the veteran lands on the VAOS homepage
      // When the page displays
      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState,
        path: '/unknown/path',
      });

      expect(screen.getByText(pageNotFoundHeading)).to.be.ok;
    });
  });
});
