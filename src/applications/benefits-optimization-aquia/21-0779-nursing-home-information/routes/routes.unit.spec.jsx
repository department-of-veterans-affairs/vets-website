import { expect } from 'chai';

import route from './routes';

describe('Routes Configuration', () => {
  describe('Route Structure', () => {
    it('should export a route object', () => {
      expect(route).to.exist;
      expect(route).to.be.an('object');
    });

    it('should have path property', () => {
      expect(route.path).to.exist;
      expect(route.path).to.equal('/');
    });

    it('should have component property', () => {
      expect(route.component).to.exist;
      // Connected component can be a function or object depending on React/Redux version
      const isValid =
        typeof route.component === 'function' ||
        (typeof route.component === 'object' && route.component !== null);
      expect(isValid).to.be.true;
    });

    it('should have indexRoute property', () => {
      expect(route.indexRoute).to.exist;
      expect(route.indexRoute).to.be.an('object');
    });

    it('should have indexRoute.onEnter function', () => {
      expect(route.indexRoute.onEnter).to.exist;
      expect(route.indexRoute.onEnter).to.be.a('function');
    });

    it('should have childRoutes property', () => {
      expect(route.childRoutes).to.exist;
      expect(route.childRoutes).to.be.an('array');
    });
  });

  describe('Index Route Behavior', () => {
    it('should redirect to introduction page', () => {
      const mockReplace = path => {
        expect(path).to.equal('/introduction');
      };

      route.indexRoute.onEnter({}, mockReplace);
    });
  });

  describe('Child Routes', () => {
    it('should have at least one child route', () => {
      expect(route.childRoutes.length).to.be.greaterThan(0);
    });

    it('should have routes with required properties', () => {
      route.childRoutes.forEach(childRoute => {
        expect(childRoute).to.have.property('path');
      });
    });
  });
});
