import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import { expect } from 'chai';

import startReactApp from '../react';

const FakeWidget = () => <div id="fake-widget">Widget</div>;

describe('startReactApp', () => {
  let renderStub;
  let sandbox;
  let reactRoot;
  let widgetRoot;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    renderStub = sandbox.stub(ReactDOM, 'render').resolves(() => {});

    reactRoot = document.createElement('div');
    reactRoot.setAttribute('id', 'react-root');
    document.body.appendChild(reactRoot);

    widgetRoot = document.createElement('div');
    widgetRoot.setAttribute('id', 'widget-root');
    document.body.appendChild(widgetRoot);
  });

  afterEach(() => {
    sandbox.restore();
    renderStub.restore();
    document.body.removeChild(reactRoot);
    document.body.removeChild(widgetRoot);
  });

  it('should render the component to #react-root when root argument is not provided', () => {
    startReactApp(FakeWidget);
    expect(renderStub.calledWith(FakeWidget, reactRoot)).to.be.true;
  });

  it('should render the component to the provided root argument when it exists', () => {
    startReactApp(FakeWidget, document.getElementById('widget-root'));
    expect(renderStub.calledWith(FakeWidget, widgetRoot)).to.be.true;
  });

  it('should not render the component if the provided root argument does not exist', () => {
    startReactApp(FakeWidget, document.getElementById('another-widget-root'));
    expect(renderStub.called).to.be.false;
  });

  it('should not render the component if the window location indicates loading in a locally saved file', () => {
    // Method from https://stackoverflow.com/a/54021633
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: { protocol: 'file:' },
      writable: true,
    });

    startReactApp(FakeWidget, document.getElementById('widget-root'));
    expect(renderStub.called).to.be.false;

    // restore
    Object.defineProperty(window, 'location', {
      value: { protocol: 'http:' },
      writable: false,
    });
  });
});
