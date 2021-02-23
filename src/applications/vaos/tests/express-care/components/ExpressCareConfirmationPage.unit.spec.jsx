import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';

import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';
import environment from 'platform/utilities/environment';

import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import {
  getExpressCareRequestCriteriaMock,
  getParentSiteMock,
  getFacilityMock,
} from '../../mocks/v0';
import {
  createTestStore,
  setExpressCareFacility,
  setExpressCareReason,
  renderWithStoreAndRouter,
} from '../../mocks/setup';
import {
  mockRequestSubmit,
  mockRequestEligibilityCriteria,
  mockParentSites,
  mockSupportedFacilities,
  mockPreferences,
  mockRequestLimit,
  setupExpressCareMocks,
} from '../../mocks/helpers';
import ExpressCareDetailsPage from '../../../express-care/components/ExpressCareDetailsPage';
import ExpressCareConfirmationPage from '../../../express-care/components/ExpressCareConfirmationPage';
import { fetchExpressCareWindows } from '../../../appointment-list/redux/actions';
import { EXPRESS_CARE } from '../../../utils/constants';

const initialState = {
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS integration: Express Care form submission', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(moment('2020-01-26T14:00:00'));
  });
  afterEach(() => {
    resetFetch();
    MockDate.reset();
  });

  it('should not allow submission of an empty form', async () => {
    setupExpressCareMocks({ isWindowOpen: true, isUnderRequestLimit: true });
    const store = createTestStore({
      ...initialState,
    });
    await setExpressCareFacility({ store });
    await setExpressCareReason({ store, label: 'Cough' });
    const screen = renderWithStoreAndRouter(<ExpressCareDetailsPage />, {
      store,
    });

    fireEvent.click(await screen.findByText(/submit express care/i));
    expect(screen.baseElement).not.to.contain.text(
      'Submitting your Express Care request',
    );
  });

  it('should submit form and show confirmation page on success', async () => {
    const store = createTestStore({
      ...initialState,
    });
    setupExpressCareMocks({ isWindowOpen: true, isUnderRequestLimit: true });
    const parentSite = {
      id: '983',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '983',
        authoritativeName: 'Some VA facility',
        rootStationCode: '983',
        parentStationCode: '983',
      },
    };
    mockParentSites(['983'], [parentSite]);
    mockPreferences('old.email@va.gov');
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
    await setExpressCareFacility({ store });
    await setExpressCareReason({ store, label: 'Cough' });
    let screen = renderWithStoreAndRouter(<ExpressCareDetailsPage />, {
      store,
    });

    await screen.findByText(/tell us about your cough/i);

    fireEvent.change(screen.getByLabelText(/tell us about your/i), {
      target: { value: requestData.attributes.additionalInformation },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: requestData.attributes.phoneNumber },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: requestData.attributes.email },
    });
    fireEvent.click(await screen.findByText(/submit express care/i));
    expect(screen.baseElement).to.contain.text(
      'Submitting your Express Care request',
    );
    await waitFor(() =>
      expect(screen.baseElement).not.to.contain.text(
        'Submitting your Express Care request',
      ),
    );
    expect(screen.history.push.lastCall.args[0]).to.equal(
      '/new-express-care-request/confirmation',
    );
    await cleanup();

    const responseData = JSON.parse(
      global.fetch
        .getCalls()
        .find(call => call.args[0].includes('appointment_requests')).args[1]
        .body,
    );

    const preferencesData = JSON.parse(
      global.fetch
        .getCalls()
        .filter(call => call.args[0].includes('preferences'))[1].args[1].body,
    );

    expect(preferencesData.emailAddress).to.equal(requestData.attributes.email);
    expect(responseData).to.deep.include({
      ...requestData.attributes,
      typeOfCareId: 'CR1',
      facility: {
        facilityCode: '983',
        parentSiteCode: '983',
        name: 'Some VA facility',
      },
      optionDate1: moment().format('MM/DD/YYYY'),
      visitType: 'Express Care',
      purposeOfVisit: 'Express Care Request',
      bestTimetoCall: ['Morning', 'Afternoon', 'Evening'],
    });

    screen = renderWithStoreAndRouter(<ExpressCareConfirmationPage />, {
      store,
    });
    expect(await screen.findByText(/Next step/)).to.exist;
    expect(screen.baseElement).to.contain('.fa-exclamation-triangle');
    expect(screen.baseElement).to.contain(
      '.vads-u-border-color--warning-message',
    );

    expect(screen.baseElement).to.contain.text('Your contact details');
    expect(screen.baseElement).to.contain.text('555-555-5555');
    expect(screen.baseElement).to.contain.text('test@va.gov');

    expect(screen.baseElement).to.contain.text(
      'You shared these details about your concern',
    );
    expect(screen.baseElement).to.contain.text('Whatever');
  });

  it('should redirect home when there is no request to show', async () => {
    const store = createTestStore({
      ...initialState,
    });
    store.dispatch(fetchExpressCareWindows());

    const screen = renderWithStoreAndRouter(<ExpressCareConfirmationPage />, {
      store,
    });

    await waitFor(() =>
      expect(screen.history.location.pathname).to.equal(
        '/new-express-care-request',
      ),
    );
  });

  it('should show generic error on submit failure', async () => {
    const store = createTestStore({
      ...initialState,
    });
    setupExpressCareMocks({ isWindowOpen: true, isUnderRequestLimit: true });
    const parentSite = {
      id: '983',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '983',
        authoritativeName: 'Some VA facility',
        rootStationCode: '983',
        parentStationCode: '983',
      },
    };
    mockParentSites(['983'], [parentSite]);
    mockPreferences('old.email@va.gov');
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
    await setExpressCareFacility({ store });
    await setExpressCareReason({ store, label: 'Cough' });
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${environment.API_URL}/vaos/v0/appointment_requests?type=va`,
      ),
      { errors: [] },
    );

    const screen = renderWithStoreAndRouter(<ExpressCareDetailsPage />, {
      store,
    });

    fireEvent.change(await screen.findByLabelText(/phone number/i), {
      target: { value: '9737790338' },
    });
    fireEvent.change(await screen.findByLabelText(/email address/i), {
      target: { value: 'judy.morrison@va.gov' },
    });
    fireEvent.click(await screen.findByText(/submit express care/i));
    expect(screen.baseElement).to.contain.text(
      'Submitting your Express Care request',
    );
    await screen.findByText(/your request didn’t go through/i);
  });

  it('should grab facility name from child if not using parent facility', async () => {
    const today = moment();
    const parentSite = {
      id: '983',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '983',
        authoritativeName: 'Some VA facility',
        rootStationCode: '983',
        parentStationCode: '983',
      },
    };
    mockParentSites(['983'], [parentSite]);
    const facility = {
      id: '983GD',
      attributes: {
        ...getFacilityMock().attributes,
        institutionCode: '983GD',
        authoritativeName: 'Bozeman VA medical center',
        rootStationCode: '983',
        parentStationCode: '983',
      },
    };
    mockSupportedFacilities({
      siteId: '983',
      parentId: '983',
      typeOfCareId: EXPRESS_CARE,
      data: [facility],
    });
    mockRequestLimit({
      facilityId: '983GD',
      numberOfRequests: 0,
    });
    const requestCriteria = getExpressCareRequestCriteriaMock('983GD', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: today
          .clone()
          .subtract(5, 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
        endTime: today
          .clone()
          .add(3, 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], [requestCriteria]);

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
    const store = createTestStore({
      ...initialState,
    });
    await setExpressCareFacility({ store });
    await setExpressCareReason({ store, label: 'Cough' });
    const screen = renderWithStoreAndRouter(<ExpressCareDetailsPage />, {
      store,
    });

    fireEvent.change(await screen.findByLabelText(/phone number/i), {
      target: { value: requestData.attributes.phoneNumber },
    });
    fireEvent.change(await screen.findByLabelText(/email address/i), {
      target: { value: requestData.attributes.email },
    });
    fireEvent.click(await screen.findByText(/submit express care/i));

    expect(screen.baseElement).to.contain.text(
      'Submitting your Express Care request',
    );
    await waitFor(() =>
      expect(screen.baseElement).not.to.contain.text(
        'Submitting your Express Care request',
      ),
    );
    expect(screen.history.push.lastCall.args[0]).to.equal(
      '/new-express-care-request/confirmation',
    );

    const responseData = JSON.parse(
      global.fetch
        .getCalls()
        .find(call => call.args[0].includes('appointment_requests')).args[1]
        .body,
    );

    expect(responseData).to.deep.include({
      facility: {
        facilityCode: '983GD',
        parentSiteCode: '983',
        name: 'Bozeman VA medical center',
      },
    });
  });

  it('should show message when submitting outside of EC window', async () => {
    const store = createTestStore({
      ...initialState,
    });
    setupExpressCareMocks({ isWindowOpen: true, isUnderRequestLimit: true });
    await setExpressCareFacility({ store });
    await setExpressCareReason({ store, label: 'Cough' });
    setupExpressCareMocks({ isWindowOpen: false, isUnderRequestLimit: true });
    store.dispatch(fetchExpressCareWindows());
    const screen = renderWithStoreAndRouter(<ExpressCareDetailsPage />, {
      store,
    });

    fireEvent.change(await screen.findByLabelText(/phone number/i), {
      target: { value: '9737790338' },
    });
    fireEvent.change(await screen.findByLabelText(/email address/i), {
      target: { value: 'judy.morrison@va.gov' },
    });
    fireEvent.click(await screen.findByText(/submit express care/i));
    await screen.findByText(/express care isn’t available right now/i);
  });
});
