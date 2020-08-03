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
import { getParentSiteMock } from '../mocks/v0';
import { createTestStore } from '../mocks/setup';
import {
  mockParentSites,
  mockSupportedFacilities,
  mockRequestSubmit,
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

const parentSite983 = {
  id: '983',
  attributes: {
    ...getParentSiteMock().attributes,
    institutionCode: '983',
    authoritativeName: 'Some VA facility',
    rootStationCode: '983',
    parentStationCode: '983',
  },
};

describe('VAOS integration: Express Care form submission', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should not allow submission of an empty form', async () => {
    mockParentSites(['983'], [parentSite983]);
    mockSupportedFacilities({
      siteId: 983,
      parentId: 983,
      typeOfCareId: 'CR1',
      data: [
        {
          id: '983',
          attributes: {
            authoritativeName: 'Testing',
            rootStationCode: '983',
            expressTimes: {
              start: '00:00',
              end: '23:59',
              timezone: 'UTC',
              offsetUtc: '-00:00',
            },
          },
        },
      ],
    });
    const store = createTestStore({
      ...initialState,
    });
    store.dispatch(fetchExpressCareWindows());

    const router = {
      push: sinon.spy(),
    };
    const screen = renderInReduxProvider(
      <ExpressCareFormPage router={router} />,
      {
        store,
      },
    );

    fireEvent.click(await screen.findByText(/submit express care/i));
    expect(await screen.findByText('Please select a symptom')).to.contain.text(
      'Please select a symptom',
    );
    expect(screen.baseElement).not.to.contain.text(
      'Submitting your Express Care request',
    );
  });

  it('should show confirmation page on success', async () => {
    mockParentSites(['983'], [parentSite983]);
    mockSupportedFacilities({
      siteId: 983,
      parentId: 983,
      typeOfCareId: 'CR1',
      data: [
        {
          id: '983',
          attributes: {
            authoritativeName: 'Testing',
            rootStationCode: '983',
            expressTimes: {
              start: '00:00',
              end: '23:59',
              timezone: 'UTC',
              offsetUtc: '-00:00',
            },
          },
        },
      ],
    });
    const store = createTestStore({
      ...initialState,
    });
    store.dispatch(fetchExpressCareWindows());
    const requestData = {
      id: 'testing',
      attributes: {
        typeOfCareId: 'CR1',
        email: 'test@va.gov',
        phoneNumber: '5555555555',
        reasonForVisit: 'Cough',
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

    const baseElement = screen.baseElement;
    fireEvent.click(await screen.getByLabelText('Cough'));
    fireEvent.change(
      await screen.getByLabelText(/please provide additional/i),
      { target: { value: requestData.attributes.additionalInformation } },
    );
    fireEvent.change(await screen.getByLabelText(/phone number/i), {
      target: { value: requestData.attributes.phoneNumber },
    });
    fireEvent.change(await screen.getByLabelText(/email address/i), {
      target: { value: requestData.attributes.email },
    });
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
        name: 'Testing',
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
    mockParentSites(['983'], [parentSite983]);
    mockSupportedFacilities({
      siteId: 983,
      parentId: 983,
      typeOfCareId: 'CR1',
      data: [
        {
          attributes: {
            expressTimes: {
              start: '00:00',
              end: '23:59',
              timezone: 'UTC',
              offsetUtc: '-00:00',
            },
          },
        },
      ],
    });
    const store = createTestStore({
      ...initialState,
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
    fireEvent.click(await screen.getByLabelText('Cough'));
    fireEvent.change(await screen.getByLabelText(/phone number/i), {
      target: { value: '9737790338' },
    });
    fireEvent.change(await screen.getByLabelText(/email address/i), {
      target: { value: 'judy.morrison@va.gov' },
    });
    fireEvent.click(await screen.findByText(/submit express care/i));
    expect(screen.baseElement).to.contain.text(
      'Submitting your Express Care request',
    );
    await screen.findByText(/your request didn’t go through/i);
  });

  it('should show message when submitting outside of EC window', async () => {
    mockParentSites(['983'], [parentSite983]);
    mockSupportedFacilities({
      siteId: 983,
      parentId: 983,
      typeOfCareId: 'CR1',
      data: [
        {
          attributes: {
            expressTimes: {
              start: moment
                .utc()
                .subtract(2, 'hours')
                .format('HH:mm'),
              end: moment
                .utc()
                .subtract(1, 'hours')
                .format('HH:mm'),
              timezone: 'UTC',
              offsetUtc: '-00:00',
            },
          },
        },
      ],
    });
    const store = createTestStore({
      ...initialState,
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

    fireEvent.click(await screen.getByLabelText('Cough'));
    fireEvent.change(await screen.getByLabelText(/phone number/i), {
      target: { value: '9737790338' },
    });
    fireEvent.change(await screen.getByLabelText(/email address/i), {
      target: { value: 'judy.morrison@va.gov' },
    });
    fireEvent.click(await screen.findByText(/submit express care/i));
    await screen.findByText(/express care isn’t available right now/i);
  });
});
