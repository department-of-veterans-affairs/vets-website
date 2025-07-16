import React from 'react';
import { expect } from 'chai';
import startReactApp from '../react';

// Component that throws immediately to trigger boundary
function Boom() {
  throw new Error('Boom');
}

describe('platform/startup RootErrorBoundary', () => {
  let originalEnv;
  let rootDiv;

  before(() => {
    originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    rootDiv = document.createElement('div');
    rootDiv.id = 'react-root';
    document.body.appendChild(rootDiv);
  });

  after(() => {
    rootDiv.remove();
    process.env.NODE_ENV = originalEnv;
  });

  it('renders fallback UI when a child component throws', done => {
    startReactApp(<Boom />, rootDiv);

    document.dispatchEvent(new Event('DOMContentLoaded'));

    setTimeout(() => {
      const alertEl = document.querySelector('va-alert');
      expect(alertEl).to.exist;
      expect(alertEl.textContent.toLowerCase()).to.include(
        'something went wrong',
      );
      done();
    }, 0);
  });
});
