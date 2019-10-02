import { expect } from 'chai';

import api, { constructUrl } from './index.js';
import { mockFetch } from '../../../testing/unit/helpers';

const host = '/v0';

describe('Api Helper', () => {
  mockFetch({
    ok: true,
    json() {},
  });

  describe('GET requests', () => {
    it('makes a basic GET request', async () => {
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

    describe('with query params', () => {
      it('makes a GET request with a single query param', async () => {
        await api.get.appointments({ foo: 'bar' });

        expect(
          global.fetch.calledWith(`${host}/appointments?foo=bar`, {
            method: 'GET',
          }),
        ).to.be.true;
      });

      it('makes a GET request with a multiple params', async () => {
        await api.get.appointments({ foo: 'bar', hello: 'world' });

        expect(
          global.fetch.calledWith(`${host}/appointments?foo=bar&hello=world`, {
            method: 'GET',
          }),
        ).to.be.true;
      });
    });
  });

  describe('POST requests', () => {
    it('makes a basic POST request', async () => {
      const veteran = { name: 'John Doe' };
      await api.post.veterans(veteran);

      expect(
        global.fetch.calledWith(`${host}/veterans`, {
          method: 'POST',
          body: JSON.stringify(veteran),
        }),
      ).to.be.true;
    });
  });

  describe('DELETE requests', () => {
    it('makes a DELETE request', async () => {
      await api.delete.appointments(1);

      expect(
        global.fetch.calledWith(`${host}/appointments/1`, {
          method: 'DELETE',
        }),
      ).to.be.true;
    });
  });

  describe('PATCH requests', () => {
    it('makes a PATCH request', async () => {
      const data = { address: '123 Red rd' };
      await api.patch.veterans['john-doe'](data);

      expect(
        global.fetch.calledWith(`${host}/veterans/john-doe`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      ).to.be.true;
    });
  });

  describe('Unsupported HTTP method', () => {
    it('throws an error', () => {
      expect(() => {
        api.corrupt.veterans();
      }).to.throw(
        'Unsupported HTTP method: corrupt.  Try one of: get/post/delete/patch instead',
      );
    });
  });
});

describe('Helper functions', () => {
  describe('constructUrl', () => {
    it('builds a url for a basic GET', () => {
      const chunks = ['employees', 'harry-potter'];

      expect(constructUrl('GET', chunks)).to.equal(
        '/v0/employees/harry-potter',
      );
    });

    it('encodes query params for GET requests', () => {
      const chunks = ['animals', 'dogs'];
      const params = { color: 'brown', age: 2 };

      expect(constructUrl('GET', chunks, params)).to.equal(
        '/v0/animals/dogs?color=brown&age=2',
      );
    });

    it('allows a single numeric id to be appended to requests', () => {
      const chunks = ['players'];

      expect(constructUrl('GET', chunks, 1)).to.equal('/v0/players/1');

      // it doesn't make sense to POST like this, but it doesn;t seem harmful
      expect(constructUrl('POST', chunks, 4)).to.equal('/v0/players/4');
      expect(constructUrl('DELETE', chunks, 9)).to.equal('/v0/players/9');
      expect(constructUrl('PATCH', chunks, 24)).to.equal('/v0/players/24');
    });
  });
});
