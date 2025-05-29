import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

// Create mocks for dependencies
const mockStartApp = sinon.stub();

describe('terms-of-use-entry', () => {
  let oldStartApp;

  before(() => {
    // Store reference to original module
    oldStartApp = require.cache[require.resolve('platform/startup')];
    // Replace module in cache with mock
    require.cache[require.resolve('platform/startup')] = {
      exports: mockStartApp,
    };
  });

  after(() => {
    // Restore original module
    require.cache[require.resolve('platform/startup')] = oldStartApp;
  });

  beforeEach(() => {
    mockStartApp.reset();
  });

  it('initializes the application with AppConfig as root component', () => {
    // Import the entry file to trigger its execution
    require('../terms-of-use-entry');

    expect(mockStartApp.called).to.be.true;

    const startAppArgs = mockStartApp.firstCall.args[0];
    expect(startAppArgs).to.have.property('url');
    expect(startAppArgs).to.have.property('routes');
    expect(startAppArgs).to.have.property('entryName');
    expect(startAppArgs).to.have.property('rootComponent');

    // Test that the rootComponent is a function that returns AppConfig
    const TestComponent = () => <div>Test Child</div>;
    const { container } = render(
      startAppArgs.rootComponent({ children: <TestComponent /> }),
    );

    expect(container.textContent).to.include('Test Child');
  });
});
