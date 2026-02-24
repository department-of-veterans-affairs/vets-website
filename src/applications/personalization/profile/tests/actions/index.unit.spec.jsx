import sinon from 'sinon';
import { expect } from 'chai';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';

import {
  fetchHero,
  FETCH_HERO,
  FETCH_HERO_SUCCESS,
  FETCH_HERO_FAILED,
  fetchPowerOfAttorney,
  FETCH_POWER_OF_ATTORNEY,
  FETCH_POWER_OF_ATTORNEY_SUCCESS,
  FETCH_POWER_OF_ATTORNEY_FAILED,
  fetchMilitaryInformation,
  FETCH_MILITARY_INFORMATION,
  FETCH_MILITARY_INFORMATION_SUCCESS,
  FETCH_MILITARY_INFORMATION_FAILED,
  fetchProfileContacts,
  FETCH_PROFILE_CONTACTS_STARTED,
  FETCH_PROFILE_CONTACTS_SUCCEEDED,
  FETCH_PROFILE_CONTACTS_FAILED,
} from '@@profile/actions';
import environment from '~/platform/utilities/environment';
import { success as fullNameSuccess } from '../../mocks/endpoints/full-name';
import { organization as poaSuccess } from '../../mocks/endpoints/power-of-attorney';
import { airForce as militaryInfoSuccess } from '../../mocks/endpoints/service-history';

import error500 from '../fixtures/500.json';
import contactsSuccess from '../fixtures/contacts.json';

describe('fetchHero action', () => {
  const endpointUrl = `${environment.API_URL}/v0/profile/full_name`;

  let captureErrorStub = null;

  beforeEach(() => {
    captureErrorStub = sinon.stub();
  });

  afterEach(() => {
    server.resetHandlers();
    if (captureErrorStub.restore) {
      captureErrorStub.restore();
    }
  });

  it('should dispatch FETCH_HERO_SUCCESS with response on success', async () => {
    server.use(
      createGetHandler(`${endpointUrl}`, () => {
        return jsonResponse(fullNameSuccess, { status: 200 });
      }),
    );

    const actionCreator = fetchHero();

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: FETCH_HERO,
    });
    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: FETCH_HERO_SUCCESS,
      hero: { userFullName: fullNameSuccess.data.attributes },
    });

    expect(dispatchSpy.callCount).to.eql(2);
  });

  it('should dispatch FETCH_HERO_FAILED with response on error', async () => {
    server.use(
      createGetHandler(`${endpointUrl}`, () => {
        return jsonResponse(error500, { status: 500 });
      }),
    );

    const actionCreator = fetchHero();

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: FETCH_HERO,
    });
    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: FETCH_HERO_FAILED,
      hero: { errors: { error: error500 } },
    });
  });
});

describe('fetchPowerOfAttorney action', () => {
  const endpointUrl = `${
    environment.API_URL
  }/representation_management/v0/power_of_attorney`;

  let captureErrorStub = null;

  beforeEach(() => {
    captureErrorStub = sinon.stub();
  });

  afterEach(() => {
    server.resetHandlers();
    if (captureErrorStub.restore) {
      captureErrorStub.restore();
    }
  });

  it('should dispatch FETCH_POWER_OF_ATTORNEY_SUCCESS with response on success', async () => {
    server.use(
      createGetHandler(`${endpointUrl}`, () => {
        return jsonResponse(poaSuccess, { status: 200 });
      }),
    );

    const actionCreator = fetchPowerOfAttorney();

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: FETCH_POWER_OF_ATTORNEY,
    });
    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: FETCH_POWER_OF_ATTORNEY_SUCCESS,
      poa: poaSuccess.data,
    });

    expect(dispatchSpy.callCount).to.eql(2);
  });

  it('should dispatch FETCH_POWER_OF_ATTORNEY_FAILED with response on error', async () => {
    server.use(
      createGetHandler(`${endpointUrl}`, () => {
        return jsonResponse({ errors: [error500] }, { status: 200 });
      }),
    );

    const actionCreator = fetchPowerOfAttorney();

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: FETCH_POWER_OF_ATTORNEY,
    });
    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: FETCH_POWER_OF_ATTORNEY_FAILED,
      poa: { errors: { errors: [error500] } },
    });

    expect(dispatchSpy.callCount).to.eql(2);
  });
});

describe('fetchMilitaryInformation action', () => {
  const endpointUrl = `${environment.API_URL}/v0/profile/service_history`;

  let recordEventStub = null;
  let createApiEventStub = null;

  beforeEach(() => {
    recordEventStub = sinon.stub();
    createApiEventStub = sinon.stub();
  });

  afterEach(() => {
    server.resetHandlers();
    if (recordEventStub.restore) {
      recordEventStub.restore();
    }
    if (createApiEventStub.restore) {
      createApiEventStub.restore();
    }
  });

  it('should dispatch FETCH_MILITARY_INFORMATION_SUCCESS with response on success', async () => {
    server.use(
      createGetHandler(`${endpointUrl}`, () => {
        return jsonResponse(militaryInfoSuccess, { status: 200 });
      }),
    );

    const actionCreator = fetchMilitaryInformation(recordEventStub);

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: FETCH_MILITARY_INFORMATION,
    });
    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: FETCH_MILITARY_INFORMATION_SUCCESS,
      militaryInformation: {
        serviceHistory: militaryInfoSuccess.data.attributes,
      },
    });

    expect(dispatchSpy.callCount).to.eql(2);
  });

  it('should dispatch FETCH_MILITARY_INFORMATION_FAILED with response on API error (response.errors)', async () => {
    server.use(
      createGetHandler(`${endpointUrl}`, () => {
        return jsonResponse(
          {
            data: {
              attributes: { errors: [{ title: 'Test Error', code: '500' }] },
            },
          },
          { status: 200 },
        );
      }),
    );

    const actionCreator = fetchMilitaryInformation(recordEventStub);

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: FETCH_MILITARY_INFORMATION,
    });
    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: FETCH_MILITARY_INFORMATION_FAILED,
      militaryInformation: {
        serviceHistory: {
          error: [{ title: 'Test Error', code: '500' }],
        },
      },
    });

    expect(dispatchSpy.callCount).to.eql(2);
  });

  it('should dispatch FETCH_MILITARY_INFORMATION_FAILED with response on API error (response.error)', async () => {
    server.use(
      createGetHandler(`${endpointUrl}`, () => {
        return jsonResponse(
          {
            data: {
              attributes: { error: { title: 'Test Error', code: '500' } },
            },
          },
          { status: 200 },
        );
      }),
    );

    const actionCreator = fetchMilitaryInformation(recordEventStub);

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: FETCH_MILITARY_INFORMATION,
    });
    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: FETCH_MILITARY_INFORMATION_FAILED,
      militaryInformation: {
        serviceHistory: {
          error: { title: 'Test Error', code: '500' },
        },
      },
    });

    expect(dispatchSpy.callCount).to.eql(2);
  });

  it('should dispatch FETCH_MILITARY_INFORMATION_FAILED on API exception', async () => {
    server.use(
      createGetHandler(`${endpointUrl}`, () => {
        return jsonResponse(error500, { status: 500 });
      }),
    );

    const actionCreator = fetchMilitaryInformation();

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: FETCH_MILITARY_INFORMATION,
    });
    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: FETCH_MILITARY_INFORMATION_FAILED,
      militaryInformation: {
        serviceHistory: {
          error: error500,
        },
      },
    });

    expect(dispatchSpy.callCount).to.eql(2);
  });

  it('should dispatch FETCH_MILITARY_INFORMATION_FAILED on exception', async () => {
    const recordEventThrownStub = sinon
      .stub()
      .throws(new Error('Analytics error'));

    const actionCreator = fetchMilitaryInformation(recordEventThrownStub);

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: FETCH_MILITARY_INFORMATION,
    });
    expect(dispatchSpy.secondCall.args[0].type).to.eql(
      FETCH_MILITARY_INFORMATION_FAILED,
    );
    expect(
      dispatchSpy.secondCall.args[0].militaryInformation.serviceHistory.error
        .message,
    ).to.eql('Analytics error');

    expect(dispatchSpy.callCount).to.eql(2);
  });
});

describe('fetchProfileContacts action', () => {
  const endpointUrl = `${environment.API_URL}/v0/profile/contacts`;

  beforeEach(() => {
    // No stubs needed for this test
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it('should dispatch FETCH_PROFILE_CONTACTS_SUCCEEDED on success', async () => {
    server.use(
      createGetHandler(`${endpointUrl}`, () => {
        return jsonResponse(contactsSuccess, { status: 200 });
      }),
    );

    const actionCreator = fetchProfileContacts();

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: FETCH_PROFILE_CONTACTS_STARTED,
    });
    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: FETCH_PROFILE_CONTACTS_SUCCEEDED,
      payload: contactsSuccess,
    });

    expect(dispatchSpy.callCount).to.eql(2);
  });

  it('should dispatch FETCH_PROFILE_CONTACTS_FAILED on error', async () => {
    server.use(
      createGetHandler(`${endpointUrl}`, () => {
        return jsonResponse(error500, { status: 500 });
      }),
    );

    const actionCreator = fetchProfileContacts();

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: FETCH_PROFILE_CONTACTS_STARTED,
    });
    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: FETCH_PROFILE_CONTACTS_FAILED,
      payload: error500,
    });

    expect(dispatchSpy.callCount).to.eql(2);
  });
});
