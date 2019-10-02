import { expect } from 'chai';

import api from './index.js';
import { mockFetch } from '../../../testing/unit/helpers';

const host = '/v0';

describe('Api Helper', () => {
  describe('GET requests', () => {
    it('makes a basic GET request', async () => {
      mockFetch({
        ok: true,
        json() {},
      });

      await api.get.veterans(); // Equivalent to resource#index

      expect(
        global.fetch.calledWith(`${host}/veterans`, {
          method: 'GET',
        }),
      ).to.be.true;
    });

    it('makes a nested GET request', async () => {
      await api.get.employees.current(); // Equivalent to resource#current

      expect(
        global.fetch.calledWith(`${host}/employees/current`, {
          method: 'GET',
        }),
      ).to.be.true;
    });

    it('makes a GET request for single resource', async () => {
      await api.get.veterans(5); // Equivalent to resource#show

      expect(
        global.fetch.calledWith(`${host}/veterans/5`, {
          method: 'GET',
        }),
      ).to.be.true;
    });
  });
});
