/**
 * @module tests/routes.unit.spec
 * @description Unit tests for routes configuration
 */

import { expect } from 'chai';
import route from './routes';

describe('Routes Configuration', () => {
  it('should export a route object', () => {
    expect(route).to.be.an('object');
  });

  it('should have correct path', () => {
    expect(route.path).to.equal('/');
  });

  it('should have App component', () => {
    expect(route.component).to.exist;
    // Connected component can be a function or object depending on React/Redux version
    const isValid =
      typeof route.component === 'function' ||
      (typeof route.component === 'object' && route.component !== null);
    expect(isValid).to.be.true;
  });

  it('should have indexRoute with onEnter function', () => {
    expect(route.indexRoute).to.exist;
    expect(route.indexRoute.onEnter).to.be.a('function');
  });

  it('should redirect to introduction page', () => {
    const mockReplace = path => path;
    const result = route.indexRoute.onEnter({}, mockReplace);
    expect(result).to.equal('/introduction');
  });

  it('should have child routes', () => {
    expect(route.childRoutes).to.exist;
    expect(route.childRoutes).to.be.an('array');
  });
});
