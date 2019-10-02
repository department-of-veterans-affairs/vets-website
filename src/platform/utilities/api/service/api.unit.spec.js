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
  });
});
