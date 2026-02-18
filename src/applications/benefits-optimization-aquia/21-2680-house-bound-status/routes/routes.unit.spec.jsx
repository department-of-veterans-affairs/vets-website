/**
 * @module tests/routes.unit.spec
 * @description Unit tests for route configuration
 */

import { expect } from 'chai';
import routes from './routes';

describe('Routes Configuration', () => {
  describe('Basic Structure', () => {
    it('should export route object', () => {
      expect(routes).to.be.an('object');
    });

    it('should have path property', () => {
      expect(routes.path).to.exist;
      expect(routes.path).to.equal('/');
    });

    it('should have component property', () => {
      expect(routes.component).to.exist;
      // Connected component can be a function or object depending on React/Redux version
      const isValid =
        typeof routes.component === 'function' ||
        (typeof routes.component === 'object' && routes.component !== null);
      expect(isValid).to.be.true;
    });

    it('should have indexRoute property', () => {
      expect(routes.indexRoute).to.exist;
      expect(routes.indexRoute).to.be.an('object');
    });

    it('should have childRoutes property', () => {
      expect(routes.childRoutes).to.exist;
      expect(routes.childRoutes).to.be.an('array');
    });
  });

  describe('Index Route', () => {
    it('should have onEnter handler', () => {
      expect(routes.indexRoute.onEnter).to.be.a('function');
    });

    it('should redirect to introduction page', () => {
      let redirectPath = null;
      const mockReplace = path => {
        redirectPath = path;
      };
      routes.indexRoute.onEnter(null, mockReplace);
      expect(redirectPath).to.equal('/introduction');
    });
  });

  describe('Child Routes', () => {
    it('should have child routes array', () => {
      expect(routes.childRoutes).to.be.an('array');
    });

    it('should have at least one child route', () => {
      expect(routes.childRoutes.length).to.be.greaterThan(0);
    });
  });
});
