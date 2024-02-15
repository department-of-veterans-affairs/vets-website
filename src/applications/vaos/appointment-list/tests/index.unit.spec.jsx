import React from 'react';
import { expect } from 'chai';
import Sinon from 'sinon';
import { renderWithStoreAndRouter } from '../../tests/mocks/setup';
import { AppointmentList } from '..';
import * as AppointmentsPage from '../components/AppointmentsPage/index';
import * as ConfirmedAppointmentDetailsPage from '../components/ConfirmedAppointmentDetailsPage';
import * as RequestedAppointmentDetailsPage from '../components/RequestedAppointmentDetailsPage';

describe('VAOS <Appointment list routes>', () => {
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
    describe('And vaOnlineSchedulingBreadcrumbUrlUpdate is true', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingBreadcrumbUrlUpdate: true,
        },
      };

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
        expect(
          AppointmentsPageStub.firstCall.args[0].location.pathname,
        ).to.equal(path);
      });
    });
  });

  describe('When route is /pending', () => {
    describe('And vaOnlineSchedulingBreadcrumbUrlUpdate is true', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingBreadcrumbUrlUpdate: true,
        },
      };

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
  });

  describe('When route is /pending/:id', () => {
    describe('And vaOnlineSchedulingBreadcrumbUrlUpdate is true', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingBreadcrumbUrlUpdate: true,
        },
      };

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
  });

  describe('When route is /past', () => {
    describe('And vaOnlineSchedulingBreadcrumbUrlUpdate is true', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingBreadcrumbUrlUpdate: true,
        },
      };

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
  });

  describe('When route is /past/:id', () => {
    describe('And vaOnlineSchedulingBreadcrumbUrlUpdate is true', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingBreadcrumbUrlUpdate: true,
        },
      };

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
  });

  describe('When route is /:id', () => {
    describe('And vaOnlineSchedulingBreadcrumbUrlUpdate is true', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingBreadcrumbUrlUpdate: true,
        },
      };

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
  });

  describe('When route is /va/:id', () => {
    describe('And vaOnlineSchedulingBreadcrumbUrlUpdate is true', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingBreadcrumbUrlUpdate: true,
        },
      };

      beforeEach(() => {
        ConfirmedAppointmentDetailsPageStub.resetHistory();
      });

      it('should render page', async () => {
        // Arrange
        const path = '/va/1';

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
  });
});
