import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import jsdom from 'jsdom';
import polyfillDataset from 'element-dataset';
import React from 'react';

chai.use(chaiAsPromised);

const expect = chai.expect;

function setupJSDom() {
  // setup the simplest document possible
  const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');

  // get the window object out of the document
  const win = doc.defaultView;

  global.document = doc;
  global.window = win;
  global.navigator = win.navigator;

  polyfillDataset();
}

function wrapWithContext(context, contextTypes, children) {
  class WrapperWithContext extends React.Component {
    getChildContext() {
      return context;
    }

    render() {
      return children;
    }
  }

  WrapperWithContext.childContextTypes = contextTypes;

  return React.createElement(WrapperWithContext);
}

function wrapWithRouterContext(component) {
  const context = { router: {} };
  const contextTypes = { router: React.PropTypes.object };
  return wrapWithContext(context, contextTypes, component);
}

export { chai, expect, setupJSDom, wrapWithContext, wrapWithRouterContext };
