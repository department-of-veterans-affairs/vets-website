import { expect } from 'chai';

import { createApiEvent } from '@@vap-svc/util/analytics';

describe('Profile', () => {
  describe('analytics utils', () => {
    describe('createApiEvent', () => {
      it('no parameters are provided and default values are used', () => {
        const result = createApiEvent();
        expect(result).to.deep.equal({
          'api-status': 'unknown',
          event: 'api_call',
          'api-name': 'unknown',
        });
      });
      it('name and status are provided', () => {
        const name = 'hello-there';
        const status = 'success';
        const result = createApiEvent({ name, status });
        expect(result).to.deep.equal({
          'api-status': status,
          event: 'api_call',
          'api-name': name,
        });
      });
      it('time is added', () => {
        const name = 'hello-there';
        const status = 'success';
        const time = 1234;
        const result = createApiEvent({ name, status, time });
        expect(result).to.deep.equal({
          'api-status': status,
          event: 'api_call',
          'api-name': name,
          'api-latency-ms': time,
        });
      });
      it('has an errorKey', () => {
        const name = 'hello-there';
        const status = 'success';
        const time = 1234;
        const errorKey = 'something went wrong';
        const result = createApiEvent({ name, status, time, errorKey });
        expect(result).to.deep.equal({
          'api-status': status,
          event: 'api_call',
          'api-name': name,
          'api-latency-ms': time,
          'error-key': errorKey,
        });
      });
    });
  });
});
