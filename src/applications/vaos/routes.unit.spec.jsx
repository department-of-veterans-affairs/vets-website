import React from 'react';
import { expect } from 'chai';
import Sinon from 'sinon';
import * as RequiredLoginView from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { render } from '@testing-library/react';
import createRoutesWithStore, { handleLoadError } from './routes';
import { createTestStore, renderWithStoreAndRouter } from './tests/mocks/setup';
import * as EnrolledRoute from './components/EnrolledRoute';
import * as VAOSApp from './components/VAOSApp';
import * as NewAppointment from './new-appointment';
import * as AppointmentList from './appointment-list';
import * as NewBookingSection from './covid-19-vaccine';

describe('VAOS <Routes>', () => {
  const sandbox = Sinon.createSandbox();
  const store = { ...createTestStore(), injectReducer: () => {} };
  const initialState = {
    user: {
      profile: {
        facilities: [{ facilityId: '000', isCerner: false }],
      },
    },
  };

  let AppointmentListStub;
  let EnrolledRouteSpy;
  let NewAppointmentStub;
  let NewBookingSectionStub;
  let RequiredLoginViewStub;
  let VAOSAppStub;

  before(() => {
    EnrolledRouteSpy = sandbox.spy(EnrolledRoute, 'default');

    // Mock the real pages since they are tested seperately.
    AppointmentListStub = sandbox
      .stub(AppointmentList, 'AppointmentList')
      .returns(<div>Mock Page</div>);
    NewAppointmentStub = sandbox
      .stub(NewAppointment, 'NewAppointment')
      .returns(<div>Mock Page</div>);
    NewBookingSectionStub = sandbox
      .stub(NewBookingSection, 'NewBookingSection')
      .returns(<div>Mock Page</div>);
    RequiredLoginViewStub = sandbox
      .stub(RequiredLoginView, 'RequiredLoginView')
      .callsFake(() => {
        return <div>{[RequiredLoginViewStub.lastCall.args[0].children]}</div>;
      });
    VAOSAppStub = sandbox.stub(VAOSApp, 'default').callsFake(() => {
      return <div>{[VAOSAppStub.lastCall.args[0].children]}</div>;
    });
  });

  after(() => {
    sandbox.restore();
  });

  beforeEach(() => {
    AppointmentListStub.resetHistory();
    NewAppointmentStub.resetHistory();
    NewBookingSectionStub.resetHistory();
  });

  describe('When route is /', () => {
    it('should render page', async () => {
      // Arrange
      const path = '/';

      // Act
      const routes = createRoutesWithStore();
      const screen = renderWithStoreAndRouter(<div>{routes}</div>, {
        initialState,
        path,
      });

      // Assert
      await screen.findByText('Mock Page');
      expect(EnrolledRouteSpy.lastCall.args[0].location.pathname).to.equal(
        path,
      );
    });
  });

  describe('When route is /new-appointment', () => {
    it('should render page', async () => {
      // Arrange
      const path = '/new-appointment';

      // Act
      const routes = createRoutesWithStore(store);
      const screen = renderWithStoreAndRouter(<div>{routes}</div>, {
        initialState,
        path,
      });

      // Assert
      await screen.findByText('Mock Page');
      expect(EnrolledRouteSpy.lastCall.args[0].location.pathname).to.equal(
        path,
      );
    });
  });

  describe('When route is /schedule', () => {
    it('should render page', async () => {
      // Arrange
      const path = '/schedule';

      // Act
      const routes = createRoutesWithStore(store);
      const screen = renderWithStoreAndRouter(<div>{routes}</div>, {
        initialState,
        path,
      });

      // Assert
      await screen.findByText('Mock Page');
      expect(EnrolledRouteSpy.lastCall.args[0].location.pathname).to.equal(
        path,
      );
    });
  });

  describe('When route is /new-covid-19-vaccine-appointment', () => {
    it('should render page', async () => {
      // Arrange
      const path = '/new-covid-19-vaccine-appointment';

      // Act
      const routes = createRoutesWithStore(store);
      const screen = renderWithStoreAndRouter(<div>{routes}</div>, {
        initialState,
        path,
      });

      // Assert
      await screen.findByText('Mock Page');
      expect(EnrolledRouteSpy.lastCall.args[0].location.pathname).to.equal(
        path,
      );
    });
  });

  describe('When route is /schedule/covid-vaccine', () => {
    it('should render page', async () => {
      // Arrange
      const path = '/schedule/covid-vaccine';

      // Act
      const routes = createRoutesWithStore(store);
      const screen = renderWithStoreAndRouter(<div>{routes}</div>, {
        initialState,
        path,
      });

      // Assert
      await screen.findByText('Mock Page');
      expect(EnrolledRouteSpy.lastCall.args[0].location.pathname).to.equal(
        path,
      );
    });
  });
});

describe('VAOS <handleLoadError>', () => {
  let orig;

  beforeEach(() => {
    // This does not working:
    // const stub = Sinon.stub(window.location, 'replace');
    //
    // The following error occurs:
    // TypeError: Cannot redefine property: replace

    // So, doing this instead.
    // Save original location object...
    orig = { ...window.location };

    // Delete location object and redefine it
    delete window.location;
    window.location = {
      pathname: '/',
      replace: Sinon.stub().callsFake(path => {
        window.location.pathname += path;
        window.location.search = path.slice(path.indexOf('?'));
      }),
    };
  });

  afterEach(() => {
    // Restore location object
    window.location = { ...orig };
  });

  describe('When dynamic import loading error: 1st time', () => {
    it('should display reloading page indicator', async () => {
      // Arrange

      // Act
      const webComponent = handleLoadError(new Error('Error'))();
      render(<>{webComponent}</>);

      // Assert
      expect(window.location.replace.lastCall.args[0]).to.equal('/?retry=1');
      expect(webComponent.type).to.equal('va-loading-indicator');
      expect(webComponent.props.message).to.equal('Reloading page');
    });
  });

  describe('When dynamic import loading error: 2nd time', () => {
    it('should display error message', async () => {
      // Arrange

      // Act
      handleLoadError(new Error('Error'));
      const webComponent = handleLoadError(
        new Error('Reloading page error!'),
      )();
      const screen = render(<>{webComponent}</>);

      // Assert
      expect(screen.getByText(/We.re sorry. We.ve run into a problem/i)).to.be
        .ok;
    });
  });
});
