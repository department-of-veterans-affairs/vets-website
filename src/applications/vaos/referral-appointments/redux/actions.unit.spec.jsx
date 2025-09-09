import { expect } from 'chai';
import sinon from 'sinon';
import * as actions from './actions';
import * as services from '../../services/referral';
import * as errorUtils from '../../utils/error';

describe('referral actions', () => {
  let sandbox;
  let dispatch;
  let clock;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    dispatch = sandbox.spy();
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  describe('fetchProviderDetails', () => {
    it('should dispatch success flow', async () => {
      const mockDetails = { name: 'Dr. Who' };
      sandbox.stub(services, 'getProviderById').resolves(mockDetails);

      const result = await actions.fetchProviderDetails('prov-id')(dispatch);

      expect(dispatch.firstCall.args[0].type).to.equal(
        actions.FETCH_PROVIDER_DETAILS,
      );
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: actions.FETCH_PROVIDER_DETAILS_SUCCEEDED,
        data: mockDetails,
      });
      expect(result).to.deep.equal(mockDetails);
    });

    it('should dispatch failure flow', async () => {
      const captureStub = sandbox.stub(errorUtils, 'captureError');
      sandbox.stub(services, 'getProviderById').rejects(new Error('fail'));

      await actions.fetchProviderDetails('prov-id')(dispatch);

      expect(
        dispatch.calledWithMatch({
          type: actions.FETCH_PROVIDER_DETAILS_FAILED,
        }),
      ).to.be.true;
      expect(captureStub.calledOnce).to.be.true;
    });
  });
});
