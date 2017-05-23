import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import jsdom from 'jsdom';
import polyfillDataset from 'element-dataset';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

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
  const contextTypes = { router: PropTypes.object };
  return wrapWithContext(context, contextTypes, component);
}

/**
 * Fills a date given a partial id and a date string
 *
 * @param {object} formDom Returned from findDOMNode(form).
 *                         Used to find the elements in the form.
 * @param {string} partialID The ID of the date elements without 'Month', 'Day', or 'Year'
 *                           e.g. 'root_children_0_childDateOfBirth'
 * @param {string} dateSTring A string representation of the date.
 *                           e.g. '12-28-2012'
 */
function fillDate(formDOM, partialId, dateString) {
  const date = dateString.split('-');
  const inputs = Array.from(formDOM.querySelectorAll('input, select'));

  ReactTestUtils.Simulate.change(inputs.find((i) => i.id === `${partialId}Month`), {
    target: {
      value: date[0]
    }
  });
  ReactTestUtils.Simulate.change(inputs.find((i) => i.id === `${partialId}Day`), {
    target: {
      value: date[1]
    }
  });
  ReactTestUtils.Simulate.change(inputs.find((i) => i.id === `${partialId}Year`), {
    target: {
      value: date[2]
    }
  });
}


export { chai, expect, setupJSDom, wrapWithContext, wrapWithRouterContext, fillDate };
