import { expect } from 'chai';
import sinon from 'sinon';
import {
  resetFetch,
  mockFetch,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import {
  fetchExpressCareWindows,
  FETCH_EXPRESS_CARE_WINDOWS,
  FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
  FETCH_EXPRESS_CARE_WINDOWS_FAILED,
} from '../../actions/expressCare';
import { mockParentSites, mockSupportedFacilities } from '../mocks/helpers';
import { getParentSiteMock } from '../mocks/v0';

describe('express care', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  const userState = {
    profile: {
      facilities: [
        {
          facilityId: '983',
          isCerner: false,
        },
      ],
    },
  };

  it('should fetch express care windows', async () => {
    const getState = () => ({
      user: userState,
      appointments: {
        futureStatus: 'notStarted',
        future: [{ facilityId: '442' }],
      },
    });
    const data = {
      data: [],
    };
    mockParentSites(
      ['983'],
      [
        {
          id: '983',
          attributes: {
            ...getParentSiteMock().attributes,
            institutionCode: '983',
            authoritativeName: 'Some VA facility',
            rootStationCode: '983',
            parentStationCode: '983',
          },
        },
      ],
    );
    mockSupportedFacilities({
      siteId: 983,
      parentId: 983,
      typeOfCareId: 'CR1',
      data: [
        {
          attributes: {
            expressTimes: {
              start: '18:00',
              end: '23:00',
              timezone: 'MDT',
              offsetUtc: '-06:00',
            },
          },
        },
      ],
    });
    const thunk = fetchExpressCareWindows();
    const dispatchSpy = sinon.spy();
    await thunk(dispatchSpy, getState);
    expect(dispatchSpy.firstCall.args[0].type).to.eql(
      FETCH_EXPRESS_CARE_WINDOWS,
    );
    expect(dispatchSpy.secondCall.args[0].type).to.eql(
      FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
    );
  });

  it('should dispatch fail action when failed to fetch windows', async () => {
    const data = {
      data: [],
    };
    setFetchJSONFailure(global.fetch, data);
    const thunk = fetchExpressCareWindows();
    const dispatchSpy = sinon.spy();
    const getState = () => ({
      user: userState,
      appointments: {},
    });
    await thunk(dispatchSpy, getState);
    expect(dispatchSpy.firstCall.args[0].type).to.eql(
      FETCH_EXPRESS_CARE_WINDOWS,
    );
    expect(dispatchSpy.lastCall.args[0].type).to.eql(
      FETCH_EXPRESS_CARE_WINDOWS_FAILED,
    );
  });
});
