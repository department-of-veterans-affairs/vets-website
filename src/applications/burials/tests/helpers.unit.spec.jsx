import { expect } from 'chai';
import sinon from 'sinon';

import { submit } from '../helpers.jsx';

import { mockFetch, resetFetch } from '../../../platform/testing/unit/helpers';
import conditionalStorage from '../../../platform/utilities/storage/conditionalStorage';

function setFetchResponse(stub, data, headers = {}) {
  const response = new Response();
  response.ok = true;
  response.headers.get = headerID => headers[headerID] || null;
  response.json = () => Promise.resolve(data);
  stub.resolves(response);
}

describe('Burials helpers', () => {
  describe('submit', () => {
    beforeEach(() => {
      conditionalStorage().setItem('userToken', 'testing');
      window.VetsGov = { pollTimeout: 1 };
      window.URL = {
        createObjectURL: sinon.stub().returns('test'),
      };
    });
    it('should reject if initial request fails', () => {
      mockFetch(new Error('fake error'), false);
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {},
      };

      return submit(form, formConfig).then(
        () => {
          expect.fail();
        },
        err => {
          expect(err.message).to.equal('fake error');
        },
      );
    });
    it('should resolve if polling state is success', () => {
      mockFetch();
      setFetchResponse(
        global.fetch.onFirstCall(),
        {
          data: {
            attributes: {
              guid: 'test',
            },
          },
        },
        { 'Content-Type': 'application/json' },
      );
      setFetchResponse(
        global.fetch.onSecondCall(),
        {
          data: {
            attributes: {
              state: 'pending',
            },
          },
        },
        { 'Content-Type': 'application/json' },
      );
      const response = {};
      setFetchResponse(
        global.fetch.onThirdCall(),
        {
          data: {
            attributes: {
              state: 'success',
              response,
            },
          },
        },
        { 'Content-Type': 'application/json' },
      );
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {},
      };

      return submit(form, formConfig).then(res => {
        expect(res).to.deep.equal(response);
      });
    });
    it('should reject if polling state is failed', () => {
      mockFetch();
      setFetchResponse(
        global.fetch.onFirstCall(),
        {
          data: {
            attributes: {
              guid: 'test',
            },
          },
        },
        { 'Content-Type': 'application/json' },
      );
      setFetchResponse(
        global.fetch.onSecondCall(),
        {
          data: {
            attributes: {
              state: 'pending',
            },
          },
        },
        { 'Content-Type': 'application/json' },
      );
      setFetchResponse(
        global.fetch.onThirdCall(),
        {
          data: {
            attributes: {
              state: 'failed',
            },
          },
        },
        { 'Content-Type': 'application/json' },
      );
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {},
      };

      return submit(form, formConfig).then(
        () => {
          expect.fail();
        },
        err => {
          expect(err.message).to.equal(
            'vets_server_error_burial: status failed',
          );
        },
      );
    });
    afterEach(() => {
      conditionalStorage().clear();
      resetFetch();
      delete window.URL;
    });
  });
});
