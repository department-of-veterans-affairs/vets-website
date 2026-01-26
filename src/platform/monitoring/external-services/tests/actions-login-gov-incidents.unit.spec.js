import { expect } from 'chai';
import sinon from 'sinon';
import {
  getLoginGovStateIncidents,
  LOADING_LOGIN_GOV_STATE_INCIDENTS,
  FETCH_LOGIN_GOV_STATE_INCIDENTS_SUCCESS,
  FETCH_LOGIN_GOV_STATE_INCIDENTS_FAILURE,
} from '../../../monitoring/external-services/actions';

describe('getLoginGovStateIncidents action', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should dispatch success action on successful API call', async () => {
    const mockData = {
      data: {
        attributes: {
          incidents: [
            {
              id: '123',
              active: true,
              states: ['AR'],
              title: 'Arkansas Maintenance',
              message: 'Down in Arkansas',
            },
          ],
        },
      },
    };

    const apiRequest = sandbox.stub().resolves(mockData);
    sandbox.stub(require('platform/utilities/api'), 'apiRequest').value(
      apiRequest,
    );

    const dispatch = sinon.spy();
    await getLoginGovStateIncidents()(dispatch);

    expect(dispatch.firstCall.args[0]).to.deep.equal({
      type: LOADING_LOGIN_GOV_STATE_INCIDENTS,
    });

    expect(dispatch.secondCall.args[0]).to.deep.equal({
      type: FETCH_LOGIN_GOV_STATE_INCIDENTS_SUCCESS,
      data: mockData.data,
    });
  });

  it('should dispatch failure action on API error', async () => {
    const apiRequest = sandbox.stub().rejects(new Error('Network error'));
    sandbox.stub(require('platform/utilities/api'), 'apiRequest').value(
      apiRequest,
    );

    const dispatch = sinon.spy();
    await getLoginGovStateIncidents()(dispatch);

    expect(dispatch.firstCall.args[0]).to.deep.equal({
      type: LOADING_LOGIN_GOV_STATE_INCIDENTS,
    });

    expect(dispatch.secondCall.args[0]).to.deep.equal({
      type: FETCH_LOGIN_GOV_STATE_INCIDENTS_FAILURE,
    });
  });

  it('should call API with correct endpoint', async () => {
    const mockData = {
      data: {
        attributes: {
          incidents: [],
        },
      },
    };

    const apiRequest = sandbox.stub().resolves(mockData);
    sandbox.stub(require('platform/utilities/api'), 'apiRequest').value(
      apiRequest,
    );

    const dispatch = sinon.spy();
    await getLoginGovStateIncidents()(dispatch);

    expect(apiRequest.calledOnce).to.be.true;
    expect(apiRequest.firstCall.args[0]).to.equal(
      '/login_gov_state_incidents',
    );
  });
});
