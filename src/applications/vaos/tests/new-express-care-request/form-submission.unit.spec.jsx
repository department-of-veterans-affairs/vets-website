import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';
import environment from 'platform/utilities/environment';

import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { getExpressCareRequestCriteriaMock } from '../mocks/v0';
import { createTestStore } from '../mocks/setup';
import {
  mockRequestSubmit,
  mockRequestEligibilityCriteria,
} from '../mocks/helpers';
import { FETCH_STATUS } from '../../utils/constants';
import ExpressCareFormPage from '../../containers/ExpressCareFormPage';
import ExpressCareConfirmationPage from '../../containers/ExpressCareConfirmationPage';
import { fetchExpressCareWindows } from '../../actions/expressCare';

const initialState = {
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS integration: Express Care form submission', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should show confirmation page on success', async () => {
    const today = moment();
    const requestCriteria = getExpressCareRequestCriteriaMock('983', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: today
          .clone()
          .subtract('30', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
        endTime: today
          .clone()
          .add('15', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], requestCriteria);
    const store = createTestStore({
      ...initialState,
      // Remove this mocking when we get a real page set up
      expressCare: {
        windowsStatus: FETCH_STATUS.notStarted,
        windows: null,
        localWindowString: null,
        minStart: null,
        maxEnd: null,
        newRequest: {
          data: {
            email: 'test@va.gov',
            phoneNumber: '5555555555',
            reasonForVisit: 'cough',
            additionalInformation: 'Whatever',
          },
        },
        submitStatus: FETCH_STATUS.notStarted,
        successfulRequest: null,
      },
    });
    store.dispatch(fetchExpressCareWindows());
    const requestData = {
      id: 'testing',
      attributes: {
        typeOfCareId: 'CR1',
        email: 'test@va.gov',
        phoneNumber: '5555555555',
        reasonForVisit: 'cough',
        additionalInformation: 'Whatever',
        status: 'Submitted',
      },
    };
    mockRequestSubmit('va', requestData);

    const router = {
      push: sinon.spy(),
    };
    let screen = renderInReduxProvider(
      <ExpressCareFormPage router={router} />,
      {
        store,
      },
    );

    fireEvent.click(await screen.findByText(/submit express care/i));
    expect(screen.baseElement).to.contain.text(
      'Submitting your Express Care request',
    );
    await waitFor(() => expect(router.push.called).to.be.true);
    expect(router.push.firstCall.args[0]).to.equal(
      '/new-express-care-request/confirmation',
    );
    await cleanup();

    const responseData = JSON.parse(
      global.fetch
        .getCalls()
        .find(call => call.args[0].includes('appointment_requests')).args[1]
        .body,
    );

    expect(responseData).to.deep.include({
      ...requestData.attributes,
      typeOfCareId: 'CR1',
      facility: {
        facilityCode: '983',
        parentSiteCode: '983',
        name: '',
      },
    });

    screen = renderInReduxProvider(
      <ExpressCareConfirmationPage router={router} />,
      {
        store,
      },
    );
    expect(screen.baseElement).to.contain.text('Next step');
    expect(screen.baseElement).to.contain('.fa-exclamation-triangle');
    expect(screen.baseElement).to.contain(
      '.vads-u-border-color--warning-message',
    );

    expect(screen.baseElement).to.contain.text('Your contact details');
    expect(screen.baseElement).to.contain.text('5555555555');
    expect(screen.baseElement).to.contain.text('test@va.gov');

    expect(screen.baseElement).to.contain.text(
      'You shared these details about your concern',
    );
    expect(screen.baseElement).to.contain.text('Whatever');
  });

  it('should redirect home when there is no request to show', async () => {
    const store = createTestStore(initialState);
    store.dispatch(fetchExpressCareWindows());

    const router = {
      replace: sinon.spy(),
    };
    const screen = renderInReduxProvider(
      <ExpressCareConfirmationPage router={router} />,
      {
        store,
      },
    );

    await waitFor(() => expect(router.replace.called).to.be.true);
    expect(screen.baseElement.textContent).to.not.be.ok;
    expect(router.replace.firstCall.args[0]).to.equal(
      '/new-express-care-request',
    );
  });
  it('should show generic error on submit failure', async () => {
    const today = moment();
    const requestCriteria = getExpressCareRequestCriteriaMock('983', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: today
          .clone()
          .subtract('30', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
        endTime: today
          .clone()
          .add('15', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], requestCriteria);
    const store = createTestStore({
      ...initialState,
      // Remove this mocking when we get a real page set up
      expressCare: {
        windowsStatus: FETCH_STATUS.notStarted,
        windows: null,
        localWindowString: null,
        minStart: null,
        maxEnd: null,
        newRequest: {
          data: {},
        },
        submitStatus: FETCH_STATUS.notStarted,
        successfulRequest: null,
      },
    });
    store.dispatch(fetchExpressCareWindows());
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${environment.API_URL}/vaos/v0/appointment_requests?type=va`,
      ),
      { errors: [] },
    );

    const screen = renderInReduxProvider(<ExpressCareFormPage />, {
      store,
    });

    fireEvent.click(await screen.findByText(/submit express care/i));
    expect(screen.baseElement).to.contain.text(
      'Submitting your Express Care request',
    );
    await screen.findByRole('alert');
    expect(screen.baseElement).to.contain.text(
      'Your request didn’t go through',
    );
  });

  it('should show message when submitting outside of EC window', async () => {
    const today = moment();
    const requestCriteria = getExpressCareRequestCriteriaMock('983', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: today
          .clone()
          .subtract('30', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
        endTime: today
          .clone()
          .subtract('15', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], requestCriteria);
    const store = createTestStore({
      ...initialState,
      // Remove this mocking when we get a real page set up
      expressCare: {
        windowsStatus: FETCH_STATUS.notStarted,
        windows: null,
        localWindowString: null,
        minStart: null,
        maxEnd: null,
        newRequest: {
          data: {},
        },
        submitStatus: FETCH_STATUS.notStarted,
        successfulRequest: null,
      },
    });
    store.dispatch(fetchExpressCareWindows());
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${environment.API_URL}/vaos/v0/appointment_requests?type=va`,
      ),
      { errors: [] },
    );

    const screen = renderInReduxProvider(<ExpressCareFormPage />, {
      store,
    });

    fireEvent.click(await screen.findByText(/submit express care/i));
    await screen.findByRole('alert');
    expect(screen.baseElement).to.contain.text(
      'Express Care isn’t available right now',
    );
  });
});
