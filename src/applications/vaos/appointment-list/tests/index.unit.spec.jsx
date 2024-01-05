import React from 'react';
import { expect } from 'chai';
import Sinon from 'sinon';
import { renderWithStoreAndRouter } from '../../tests/mocks/setup';
import { AppointmentList } from '..';
import * as AppointmentsPage from '../components/AppointmentsPage/index';
import * as ConfirmedAppointmentDetailsPage from '../components/ConfirmedAppointmentDetailsPage';
import * as RequestedAppointmentDetailsPage from '../components/RequestedAppointmentDetailsPage';

describe('VAOS <Routes>', () => {
  // Mock the real pages since they are tested seperately.
  const sandbox = Sinon.createSandbox();
  const ConfirmedAppointmentDetailsPageStub = sandbox
    .stub(ConfirmedAppointmentDetailsPage, 'default')
    .returns(<div>Mock Page</div>);
  const RequestedAppointmentDetailsPageStub = sandbox
    .stub(RequestedAppointmentDetailsPage, 'default')
    .returns(<div>Mock Page</div>);
  const AppointmentsPageStub = sandbox
    .stub(AppointmentsPage, 'default')
    .returns(<div>Mock Page</div>);

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

    describe('And vaOnlineSchedulingBreadcrumbUrlUpdate is false', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingBreadcrumbUrlUpdate: false,
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

  describe('When route is /:pastOrPending?/cc/:id', () => {
    describe('And vaOnlineSchedulingBreadcrumbUrlUpdate is false', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingBreadcrumbUrlUpdate: false,
        },
      };

      beforeEach(() => {
        ConfirmedAppointmentDetailsPageStub.resetHistory();
      });

      it('should render page for route /past/cc/:id', async () => {
        // Arrange
        const path = '/past/cc/1';

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

      it('should render page for route /pending/cc/:id', async () => {
        // Arrange
        const path = '/pending/cc/1';

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

  describe('When route is /:pastOrPending?/va/:id', () => {
    describe('And vaOnlineSchedulingBreadcrumbUrlUpdate is false', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingBreadcrumbUrlUpdate: false,
        },
      };

      beforeEach(() => {
        ConfirmedAppointmentDetailsPageStub.resetHistory();
      });

      it('should render page for route /past/va/:id', async () => {
        // Arrange
        const path = '/past/va/1';

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

      it('should render page for route /pending/va/:id', async () => {
        // Arrange
        const path = '/pending/va/1';

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

  describe('When route is /:pastOrPending?/requests/:id', () => {
    describe('And vaOnlineSchedulingBreadcrumbUrlUpdate is false', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingBreadcrumbUrlUpdate: false,
        },
      };

      beforeEach(() => {
        RequestedAppointmentDetailsPageStub.resetHistory();
      });

      it('should render page for route /past/requests/:id', async () => {
        // Arrange
        const path = '/past/requests/1';

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

      it('should render page for route /pending/requests/:id', async () => {
        // Arrange
        const path = '/pending/requests/1';

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
