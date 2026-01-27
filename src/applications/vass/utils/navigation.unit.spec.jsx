import { expect } from 'chai';
import {
  routes,
  findMissingField,
  findRouteForField,
  getFirstTokenRoute,
} from './navigation';
import { AUTH_LEVELS, URLS } from './constants';

describe('VASS Utils: navigation', () => {
  describe('routes', () => {
    it('should export an array of route configurations', () => {
      expect(routes).to.be.an('array');
      expect(routes.length).to.be.equal(9);
    });

    it('should have required properties for each route', () => {
      routes.forEach(route => {
        expect(route).to.have.property('path');
        expect(route).to.have.property('component');
        expect(route).to.have.property('permissions');
        expect(route.permissions).to.have.property('requiresAuthorization');
      });
    });

    it('should have the verify route as the first route with no auth required', () => {
      const verifyRoute = routes.find(r => r.path === URLS.VERIFY);
      expect(verifyRoute).to.exist;
      expect(verifyRoute.permissions.requiresAuthorization).to.equal(
        AUTH_LEVELS.NONE,
      );
    });

    it('should have enter-otc route with lowAuthOnly authorization', () => {
      const enterOtcRoute = routes.find(r => r.path === URLS.ENTER_OTC);
      expect(enterOtcRoute).to.exist;
      expect(enterOtcRoute.permissions.requiresAuthorization).to.equal(
        AUTH_LEVELS.LOW_AUTH_ONLY,
      );
      expect(enterOtcRoute.permissions.requireFormData).to.deep.equal([
        'uuid',
        'lastname',
        'dob',
        'obfuscatedEmail',
      ]);
    });

    it('should have date-time route with token authorization', () => {
      const dateTimeRoute = routes.find(r => r.path === URLS.DATE_TIME);
      expect(dateTimeRoute).to.exist;
      expect(dateTimeRoute.permissions.requiresAuthorization).to.equal(
        AUTH_LEVELS.TOKEN,
      );
    });

    it('should have review route with required form data', () => {
      const reviewRoute = routes.find(r => r.path === URLS.REVIEW);
      expect(reviewRoute).to.exist;
      expect(reviewRoute.permissions.requireFormData).to.include('uuid');
      expect(reviewRoute.permissions.requireFormData).to.include(
        'selectedDate',
      );
      expect(reviewRoute.permissions.requireFormData).to.include(
        'selectedTopics',
      );
    });

    it('should have routes with setsData property documenting data flow', () => {
      const verifyRoute = routes.find(r => r.path === URLS.VERIFY);
      expect(verifyRoute.setsData).to.deep.equal([
        'uuid',
        'lastname',
        'dob',
        'obfuscatedEmail',
      ]);

      const dateTimeRoute = routes.find(r => r.path === URLS.DATE_TIME);
      expect(dateTimeRoute.setsData).to.deep.equal(['selectedDate']);

      const topicRoute = routes.find(r => r.path === URLS.TOPIC_SELECTION);
      expect(topicRoute.setsData).to.deep.equal(['selectedTopics']);
    });
  });

  describe('getFirstTokenRoute', () => {
    it('should return the first route that requires token authorization', () => {
      const result = getFirstTokenRoute();
      // The first token route in the routes array is DATE_TIME
      expect(result).to.equal(URLS.DATE_TIME);
    });

    it('should return a path that corresponds to a token-protected route', () => {
      const result = getFirstTokenRoute();
      const tokenRoute = routes.find(r => r.path === result);
      expect(tokenRoute).to.exist;
      expect(tokenRoute.permissions.requiresAuthorization).to.equal(
        AUTH_LEVELS.TOKEN,
      );
    });
  });

  describe('findRouteForField', () => {
    it('should return the path of the route that sets uuid', () => {
      const result = findRouteForField('uuid');
      expect(result).to.equal(URLS.VERIFY);
    });

    it('should return the path of the route that sets lastname', () => {
      const result = findRouteForField('lastname');
      expect(result).to.equal(URLS.VERIFY);
    });

    it('should return the path of the route that sets dob', () => {
      const result = findRouteForField('dob');
      expect(result).to.equal(URLS.VERIFY);
    });

    it('should return the path of the route that sets obfuscatedEmail', () => {
      const result = findRouteForField('obfuscatedEmail');
      expect(result).to.equal(URLS.VERIFY);
    });

    it('should return the path of the route that sets selectedDate', () => {
      const result = findRouteForField('selectedDate');
      expect(result).to.equal(URLS.DATE_TIME);
    });

    it('should return the path of the route that sets selectedTopics', () => {
      const result = findRouteForField('selectedTopics');
      expect(result).to.equal(URLS.TOPIC_SELECTION);
    });

    it('should return "/" as fallback for unknown fields', () => {
      const result = findRouteForField('unknownField');
      expect(result).to.equal('/');
    });
  });

  describe('findMissingField', () => {
    it('should return null when all required fields are present', () => {
      const requiredFields = ['uuid', 'lastname', 'dob'];
      const formState = {
        uuid: 'test-uuid',
        lastname: 'Doe',
        dob: '1990-01-15',
      };
      const result = findMissingField(requiredFields, formState);
      expect(result).to.be.null;
    });

    it('should return the first missing field', () => {
      const requiredFields = ['uuid', 'lastname', 'dob'];
      const formState = {
        uuid: 'test-uuid',
        lastname: null,
        dob: '1990-01-15',
      };
      const result = findMissingField(requiredFields, formState);
      expect(result).to.equal('lastname');
    });

    it('should return the first field when all are missing', () => {
      const requiredFields = ['uuid', 'lastname', 'dob'];
      const formState = {};
      const result = findMissingField(requiredFields, formState);
      expect(result).to.equal('uuid');
    });

    it('should handle empty string as missing data', () => {
      const requiredFields = ['uuid', 'lastname'];
      const formState = {
        uuid: '',
        lastname: 'Doe',
      };
      const result = findMissingField(requiredFields, formState);
      expect(result).to.equal('uuid');
    });

    it('should handle undefined as missing data', () => {
      const requiredFields = ['uuid', 'lastname'];
      const formState = {
        uuid: undefined,
        lastname: 'Doe',
      };
      const result = findMissingField(requiredFields, formState);
      expect(result).to.equal('uuid');
    });

    it('should return null for empty required fields array', () => {
      const requiredFields = [];
      const formState = {};
      const result = findMissingField(requiredFields, formState);
      expect(result).to.be.null;
    });

    describe('selectedTopics special handling', () => {
      it('should treat empty selectedTopics array as missing', () => {
        const requiredFields = ['uuid', 'selectedTopics'];
        const formState = {
          uuid: 'test-uuid',
          selectedTopics: [],
        };
        const result = findMissingField(requiredFields, formState);
        expect(result).to.equal('selectedTopics');
      });

      it('should treat non-empty selectedTopics array as present', () => {
        const requiredFields = ['uuid', 'selectedTopics'];
        const formState = {
          uuid: 'test-uuid',
          selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
        };
        const result = findMissingField(requiredFields, formState);
        expect(result).to.be.null;
      });

      it('should treat null selectedTopics as missing', () => {
        const requiredFields = ['selectedTopics'];
        const formState = {
          selectedTopics: null,
        };
        const result = findMissingField(requiredFields, formState);
        expect(result).to.equal('selectedTopics');
      });

      it('should treat undefined selectedTopics as missing', () => {
        const requiredFields = ['selectedTopics'];
        const formState = {};
        const result = findMissingField(requiredFields, formState);
        expect(result).to.equal('selectedTopics');
      });
    });

    describe('complex form state scenarios', () => {
      it('should validate review page requirements', () => {
        const requiredFields = [
          'uuid',
          'lastname',
          'dob',
          'obfuscatedEmail',
          'selectedDate',
          'selectedTopics',
        ];
        const completeFormState = {
          uuid: 'c0ffee-1234',
          lastname: 'Doe',
          dob: '1990-01-15',
          obfuscatedEmail: 't***@example.com',
          selectedDate: '2025-01-15T10:00:00.000Z',
          selectedTopics: [{ topicId: '1', topicName: 'Health' }],
        };
        expect(findMissingField(requiredFields, completeFormState)).to.be.null;
      });

      it('should return missing field for incomplete review page data', () => {
        const requiredFields = [
          'uuid',
          'lastname',
          'dob',
          'obfuscatedEmail',
          'selectedDate',
          'selectedTopics',
        ];
        const incompleteFormState = {
          uuid: 'c0ffee-1234',
          lastname: 'Doe',
          dob: '1990-01-15',
          obfuscatedEmail: 't***@example.com',
          selectedDate: '2025-01-15T10:00:00.000Z',
          selectedTopics: [], // Missing topics
        };
        expect(findMissingField(requiredFields, incompleteFormState)).to.equal(
          'selectedTopics',
        );
      });

      it('should validate enter-otc page requirements', () => {
        const requiredFields = ['uuid', 'lastname', 'dob', 'obfuscatedEmail'];
        const formState = {
          uuid: 'c0ffee-1234',
          lastname: 'Doe',
          dob: '1990-01-15',
          obfuscatedEmail: 't***@example.com',
        };
        expect(findMissingField(requiredFields, formState)).to.be.null;
      });
    });
  });
});
