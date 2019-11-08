import { expect } from 'chai';
import sinon from 'sinon';

import {
  resetFetch,
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import {
  checkRegistration,
  REGISTRATION_CHECK,
  REGISTRATION_CHECK_SUCCEEDED,
  REGISTRATION_CHECK_FAILED,
} from './../../actions/registration';

import systems from '../../api/systems';

describe('VAOS actions: registration', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  it('should fetch system identifiers', async () => {
    setFetchJSONResponse(global.fetch, systems);
    const thunk = checkRegistration();
    const dispatchSpy = sinon.spy();

    await thunk(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0].type).to.equal(REGISTRATION_CHECK);
    expect(dispatchSpy.secondCall.args[0]).to.deep.equal({
      type: REGISTRATION_CHECK_SUCCEEDED,
      systemIds: systems.data.map(item => item.attributes),
    });
  });

  it('should fail to fetch system identifiers', async () => {
    setFetchJSONFailure(global.fetch, systems);
    const thunk = checkRegistration();
    const dispatchSpy = sinon.spy();

    await thunk(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0].type).to.equal(REGISTRATION_CHECK);
    expect(dispatchSpy.secondCall.args[0].type).to.equal(
      REGISTRATION_CHECK_FAILED,
    );
  });
});
