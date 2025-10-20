/**
 * @module tests/containers/app.unit.spec
 * @description Unit tests for App container component
 */

import { expect } from 'chai';
import appDefault, { App } from './app';

describe('App', () => {
  describe('Component Export', () => {
    it('should export App component', () => {
      expect(App).to.exist;
      expect(App).to.be.a('function');
    });

    it('should be a valid React component', () => {
      expect(App.name).to.equal('App');
    });

    it('should export as default', () => {
      expect(appDefault).to.exist;
      expect(appDefault).to.be.a('function');
    });

    it('should have default export equal to named export', () => {
      expect(appDefault).to.equal(App);
    });

    it('should have a length property', () => {
      expect(App).to.have.property('length');
      expect(App.length).to.be.a('number');
    });

    it('should accept parameters', () => {
      expect(App.length).to.equal(1);
    });
  });
});
