/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import { datadogRum } from '@datadog/browser-rum';
import * as recordEventModule from 'platform/monitoring/record-event';
import NonPatientLandingPage from '../../../components/nonPatientPage/NonPatientLandingPage';
import reducers from '../../../reducers';

const stateFn = ({
  mhv_milestone_2_changes_enabled = true,
  mhvAccountState = 'OK',
} = {}) => ({
  featureToggles: {
    mhv_milestone_2_changes_enabled,
  },
  user: {
    profile: {
      vaPatient: false,
      edipi: '1234567890',
      mhvAccountState,
    },
  },
});

const setup = ({ initialState = stateFn(), props = {} } = {}) =>
  renderWithStoreAndRouter(<NonPatientLandingPage {...props} />, {
    initialState,
    reducers,
  });

describe('NonPatientLandingPage component', () => {
  let originalReplaceState;

  beforeEach(() => {
    originalReplaceState = window.history.replaceState;
    window.history.replaceState = sinon.spy();
  });

  afterEach(() => {
    window.history.replaceState = originalReplaceState;
  });
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

  it('sets the correct search param', () => {
    setup();
    expect(window.history.replaceState.calledOnce).to.be.true;
    const { args } = window.history.replaceState.getCall(0);
    const url = new URL(args[2], 'http://localhost');
    expect(url.searchParams.get('page')).to.equal('non-patient');
  });

  it('calls recordEvent and datadogRum', async () => {
    const recordEventSpy = sinon.stub(recordEventModule, 'default');
    const datadogRumSpy = sinon.spy(datadogRum, 'addAction');
    setup();
    expect(recordEventSpy.calledOnce).to.be.true;
    expect(recordEventSpy.calledWith({ event: 'nav-non-patient-landing-page' }))
      .to.be.true;
    expect(datadogRumSpy.calledOnce).to.be.true;

    recordEventSpy.restore();
    datadogRumSpy.restore();
  });
});
