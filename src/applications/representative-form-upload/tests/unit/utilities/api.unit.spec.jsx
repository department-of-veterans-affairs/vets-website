import { expect } from 'chai';
import sinon from 'sinon';
import api from '../../../utilities/api';

describe('API utilities', () => {
  let sandbox;
  let fetchStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    fetchStub = sandbox.stub(global, 'fetch');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getUser', () => {
    it('calls correct user endpoint', async () => {
      const successResponse = new Response(JSON.stringify({ data: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      fetchStub.resolves(successResponse);

      await api.getUser();

      expect(fetchStub.called).to.be.true;
      const url = fetchStub.firstCall.args[0];
      expect(url).to.include('/user');
    });
  });
});
