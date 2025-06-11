import { expect } from 'chai';

import { createAnalyticsSlug, createApiEvent } from './index';
import { APP_NAMES } from '../appConstants';

describe('Pre check in', () => {
  describe('analytics utils', () => {
    describe('createAnalyticsSlug', () => {
      it('returns a created slug  with undefined', () => {
        const slug = undefined;
        const result = createAnalyticsSlug(slug);
        expect(result).to.equal('check-in-undefined');
      });
      it('returns a created slug  with value', () => {
        const slug = 'testing';
        const result = createAnalyticsSlug(slug);
        expect(result).to.equal('check-in-testing');
      });
      it('returns custom prefix', () => {
        const slug = 'testing';
        const result = createAnalyticsSlug(slug, 'nav');
        expect(result).to.equal('nav-check-in-testing');
      });
      it('returns different app context', () => {
        const slug = 'testing';
        const result = createAnalyticsSlug(slug, null, APP_NAMES.TRAVEL_CLAIM);
        expect(result).to.equal('travel-claim-testing');
      });
    });
    describe('createApiEvent', () => {
      it('no parameters are provided and it stuff creates and objects', () => {
        const result = createApiEvent();
        expect(result).to.deep.equal({
          'api-status': undefined,
          event: 'api_call',
          'api-name': undefined,
        });
      });
      it('name and status are provided', () => {
        const name = 'hello-there';
        const status = 'success';
        const result = createApiEvent(name, status);
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
        const result = createApiEvent(name, status, time);
        expect(result).to.deep.equal({
          'api-status': status,
          event: 'api_call',
          'api-name': name,
          // eslint-disable-next-line camelcase
          api_latency_ms: time,
        });
      });
      it('token is added', () => {
        const name = 'hello-there';
        const status = 'success';
        const time = 1234;
        const token = 'UUID';
        const result = createApiEvent(name, status, time, token);
        expect(result).to.deep.equal({
          'api-status': status,
          event: 'api_call',
          'api-name': name,
          // eslint-disable-next-line camelcase
          api_latency_ms: time,
          'api-request-id': token,
        });
      });
      it('has an error', () => {
        const name = 'hello-there';
        const status = 'success';
        const time = 1234;
        const token = 'UUID';
        const error = 'something went wrong';
        const result = createApiEvent(name, status, time, token, error);
        expect(result).to.deep.equal({
          'api-status': status,
          event: 'api_call',
          'api-name': name,
          // eslint-disable-next-line camelcase
          api_latency_ms: time,
          'error-key': error,
          'api-request-id': token,
        });
      });
    });
  });
});
