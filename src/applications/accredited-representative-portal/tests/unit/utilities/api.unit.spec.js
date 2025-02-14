import { expect } from 'chai';
import sinon from 'sinon';
import api from '../../../utilities/api';

describe('API Utilities', () => {
  let fetchStub;

  beforeEach(() => {
    fetchStub = sinon.stub(global, 'fetch');
  });

  afterEach(() => {
    fetchStub.restore();
  });

  describe('createPOARequestDecision', () => {
    it('should expose HTTP status codes from failed requests', async () => {
      // Mock fetch to return a 403
      fetchStub.resolves(
        new Response(JSON.stringify({ errors: ['Not authorized'] }), {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );

      try {
        await api.createPOARequestDecision('123', { type: 'acceptance' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.have.property('status', 403);
      }
    });

    it('should handle network errors', async () => {
      // Mock fetch to simulate network failure
      fetchStub.rejects(new Error('Network error'));

      try {
        await api.createPOARequestDecision('123', { type: 'acceptance' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.have.property('message', 'Network error');
      }
    });

    it('should make requests with correct parameters', async () => {
      // Mock successful request
      fetchStub.resolves(
        new Response(JSON.stringify({ status: 'success' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );

      await api.createPOARequestDecision('123', { type: 'acceptance' });

      expect(
        fetchStub.calledWith(
          sinon.match(url =>
            url.includes('/power_of_attorney_requests/123/decision'),
          ),
          sinon.match({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              decision: { type: 'acceptance' },
            }),
          }),
        ),
      ).to.be.true;
    });
  });
});
