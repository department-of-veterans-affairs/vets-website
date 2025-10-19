/**
 * @module tests/containers/app.unit.spec
 * @description Unit tests for App container component
 */

import { expect } from 'chai';
import { App } from './app';

describe('App', () => {
  describe('Component Export', () => {
    it('should export App component', () => {
      expect(App).to.exist;
      expect(App).to.be.a('function');
    });

    it('should be a valid React component', () => {
      expect(App.name).to.equal('App');
    });
  });
});
