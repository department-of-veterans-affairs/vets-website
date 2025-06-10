/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
// import sinon from 'sinon';
// import { datadogRum } from '@datadog/browser-rum';

import NonPatientLandingPage from '../../../components/nonPatientPage/NonPatientLandingPage';
import reducers from '../../../reducers';

const stateFn = ({ mhvAccountState = 'OK' } = {}) => ({
  user: {
    profile: {
      userFullName: {
        first: 'Sam',
      },
      loa: { current: 3 },
      vaPatient: false,
      edipi: '1234567890',
      mhvAccountState,
    },
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderWithStoreAndRouter(<NonPatientLandingPage />, {
    initialState,
    reducers,
  });

// let originalReplaceState;
// let originalDatadogAction;
// let recordEvent;

// beforeEach(() => {
//   originalReplaceState = window.history.replaceState;
//   window.history.replaceState = sinon.spy();

//   originalDatadogAction = datadogRum.addAction;
//   datadogRum.addAction = sinon.spy();

//   recordEvent = sinon.spy();
// });

// afterEach(() => {
//   window.history.replaceState = originalReplaceState;
//   datadogRum.addAction = originalDatadogAction;
// });

describe('NonPatientLandingPage component', () => {
  it('renders', () => {
    const { getByRole } = setup();
    expect(getByRole('heading', { level: 1, name: /My HealtheVet/ })).to.exist;
    expect(
      getByRole('heading', {
        level: 2,
        name: /We don’t have VA health records for you/,
      }),
    ).to.exist;
    expect(
      getByRole('heading', {
        level: 2,
        name: /Download your data/,
      }),
    ).to.exist;
  });

  it('renders without Download option', () => {
    const initialState = stateFn({ mhvAccountState: 'NONE' });
    const { getByRole, queryByRole } = setup({ initialState });
    expect(getByRole('heading', { level: 1, name: /My HealtheVet/ })).to.exist;
    expect(
      getByRole('heading', {
        level: 2,
        name: /We don’t have VA health records for you/,
      }),
    ).to.exist;
    expect(
      queryByRole('heading', {
        level: 2,
        name: /Download your data/,
      }),
    ).to.not.exist;
  });

  // it('sets the correct search param', () => {
  //   setup();
  //   expect(window.history.replaceState.calledOnce).to.be.true;
  //   const { args } = window.history.replaceState.getCall(0);
  //   const url = new URL(args[2], 'http://localhost');
  //   expect(url.searchParams.get('page')).to.equal('non-patient');
  // });

  // it('calls datadogRum.addAction', () => {
  //   setup();
  //   expect(datadogRum.addAction.calledOnce).to.be.true;
  // });

  // it('calls recordEvent', () => {
  //   setup({ props: { recordEvent } });
  //   expect(recordEvent.calledOnce).to.be.true;
  //   expect(recordEvent.calledWith({ event: 'nav-non-patient-landing-page' })).to
  //     .be.true;
  // });
});
