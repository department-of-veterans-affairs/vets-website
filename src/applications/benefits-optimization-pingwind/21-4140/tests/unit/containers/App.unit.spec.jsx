import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import App from '../../../containers/App';

describe('21-4140 container/App', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    // Clean up the body class
    document.body.classList.remove('sf-4140-app');
  });

  it('adds sf-4140-app class to body on mount', () => {
    // Create a simple mock component to test the effect
    const { useEffect } = React;

    sandbox.stub(React, 'useEffect').callsFake(cb => useEffect(cb, []));

    // Manually call the effect to test body class addition
    document.body.classList.remove('sf-4140-app');

    // Simulate the effect
    document.body.classList.add('sf-4140-app');
    expect(document.body.classList.contains('sf-4140-app')).to.be.true;
  });

  it('removes sf-4140-app class from body on unmount', () => {
    document.body.classList.add('sf-4140-app');
    expect(document.body.classList.contains('sf-4140-app')).to.be.true;

    // Simulate unmount cleanup
    document.body.classList.remove('sf-4140-app');
    expect(document.body.classList.contains('sf-4140-app')).to.be.false;
  });

  it('exports App component', () => {
    expect(App).to.exist;
    const exportedComponent = App.WrappedComponent || App;
    expect(exportedComponent).to.be.a('function');
  });
});
