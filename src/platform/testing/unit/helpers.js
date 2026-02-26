import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import PropTypes from 'prop-types';
import React from 'react';
import { createMemoryHistory } from 'history-v4';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon-v20';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

chai.use(chaiAsPromised);

const { expect } = chai;

/**
 * Wraps the given children with a new component with context from
 * context and contextTypes.
 *
 * @param {object} context The context object for the new component
 * @param {object} contextTypes An object with a prop type description of
 * @param {React.Element} children React elements that the new component will wrap
 * @returns {React.Element} A new React element that wraps children with context
 */
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

/**
 * Wraps the given component with a component with an emtpy
 * router object in context.
 *
 * @param {React.Component} component The component to wrap with router context
 * @returns {React.Element} A new React element that wraps component
 */
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
 * @param {string} dateString A string representation of the date.
 *                           e.g. '2012-1-28'
 */
function fillDate(formDOM, partialId, dateString) {
  const date = dateString.split('-');
  const inputs = Array.from(formDOM.querySelectorAll('input, select'));
  ReactTestUtils.Simulate.change(
    inputs.find(i => i.id === `${partialId}Month`),
    {
      target: {
        value: date[1],
      },
    },
  );
  ReactTestUtils.Simulate.change(inputs.find(i => i.id === `${partialId}Day`), {
    target: {
      value: date[2],
    },
  });
  ReactTestUtils.Simulate.change(
    inputs.find(i => i.id === `${partialId}Year`),
    {
      target: {
        value: date[0],
      },
    },
  );
}

/**
 * Allows the user to change a dropdown input to the value provided
 *
 * @param {object} form
 * @param {string} selector
 * @param {string} value
 */
export function changeDropdown(form, selector, value) {
  const field = form.find(selector);
  field.simulate('change', {
    target: { value },
  });
}

/**
 * A function to mock the global fetch function and return
 * the value provided in returnVal.
 *
 * @param returnVal The value to return from the fetch promise
 * @param {boolean} [shouldResolve=true] Returns a rejected promise if this is false
 */
function mockFetch(returnVal, shouldResolve = true) {
  const fetchStub = sinon.stub(global, 'fetch');
  fetchStub.callsFake(url => {
    let response = returnVal;
    if (!response) {
      // Use status 404 to make ok = false (read-only in Node 22)
      response = new Response(null, {
        status: 404,
        statusText: 'Not Found',
      });

      // Define url as a writable property (read-only in native Response)
      Object.defineProperty(response, 'url', {
        value: url,
        writable: true,
        configurable: true,
      });
    }

    return shouldResolve ? Promise.resolve(response) : Promise.reject(response);
  });
}

export function setFetchJSONResponse(stub, data = null) {
  // Use status 200 to make ok = true (read-only in Node 22)
  const response = new Response(null, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

  // Define url as a writable property (read-only in native Response)
  Object.defineProperty(response, 'url', {
    value: environment.API_URL,
    writable: true,
    configurable: true,
  });

  if (data) {
    response.json = () => Promise.resolve(data);
  }
  stub.resolves(response);
}

export function setFetchJSONFailure(stub, data) {
  // Use status 400 to make ok = false (read-only in Node 22)
  const response = new Response(null, {
    status: 400,
    headers: { 'content-type': ['application/json'] },
  });

  // Define url as a writable property (read-only in native Response)
  Object.defineProperty(response, 'url', {
    value: environment.API_URL,
    writable: true,
    configurable: true,
  });

  response.json = () => Promise.resolve(data);
  stub.resolves(response);
}

export function setFetchBlobResponse(stub, data) {
  // Use status 200 to make ok = true (read-only in Node 22)
  const response = new Response(null, { status: 200 });

  // Define url as a writable property (read-only in native Response)
  Object.defineProperty(response, 'url', {
    value: environment.API_URL,
    writable: true,
    configurable: true,
  });

  response.blob = () => Promise.resolve(data);
  stub.resolves(response);
}

export function setFetchBlobFailure(stub, error) {
  // Use status 400 to make ok = false (read-only in Node 22)
  const response = new Response(null, { status: 400 });

  // Define url as a writable property (read-only in native Response)
  Object.defineProperty(response, 'url', {
    value: environment.API_URL,
    writable: true,
    configurable: true,
  });

  response.blob = () => Promise.reject(new Error(error));
  stub.resolves(response);
}

/**
 * Resets the fetch mock set with mockFetch
 */
function resetFetch() {
  if (global.fetch.isSinonProxy) {
    global.fetch.restore();
  }
}

const getApiRequestObject = returnVal => ({
  headers: {
    get: () => 'application/json',
  },
  ok: true,
  json: () => Promise.resolve(returnVal),
  url: environment.API_URL,
});

/**
 * This doesn't so much _mock_ the function as it does set up the fetch to return what we
 * need it to from apiRequest(). Feel free to rename this to something more appropriate.
 *
 * @param {} returnVal The value to return from the json promise
 * @param {boolean} [shouldResolve=true] Returns a rejected promise if this is false
 */
function mockApiRequest(returnVal, shouldResolve = true) {
  const returnObj = getApiRequestObject(returnVal);
  mockFetch(returnObj, shouldResolve);
}

/**
 * @typedef {Object} Response
 * @property {} response - The value the fake fetch should return
 * @property {boolean} shouldResolve - Whether the fetch promise should resolve or not
 * ---
 * @param {Response[]} responses - An array of responses which subsequent fetch calls should return
 */
function mockMultipleApiRequests(responses) {
  mockFetch();
  responses.forEach((res, index) => {
    const { response, shouldResolve } = res;
    const formattedResponse = getApiRequestObject(response);
    global.fetch
      .onCall(index)
      .returns(
        shouldResolve
          ? Promise.resolve(formattedResponse)
          : Promise.reject(formattedResponse),
      );
  });
}

/**
 * Mocks event listeners for the target being passed (e.g., a mock window).
 *
 * @param {object} target - The object to supplement with event listeners
 * @returns {object} The target with a mock event listener
 */
const mockEventListeners = (target = {}) => {
  const eventListeners = {};
  return {
    ...target,
    eventListeners,
    addEventListener: (eventType, callback) => {
      if (eventListeners[eventType]) {
        eventListeners[eventType].push(callback);
      } else {
        eventListeners[eventType] = [callback];
      }
    },
    simulate: (eventType, eventObject) => {
      if (eventListeners[eventType]) {
        eventListeners[eventType].forEach(callback => callback(eventObject));
      }
    },
  };
};

/**
 * Creates a history object and attaches a spy to replace and push.
 * The history object is fully functional, not stubbed.
 *
 * @export
 * @param {string} [path='/'] - The initial url to use for the history
 * @returns {History} A History object
 */
const createTestHistory = (path = '/') => {
  const history = createMemoryHistory({ initialEntries: [path] });
  sinon.spy(history, 'replace');
  sinon.spy(history, 'push');

  // Add backwards-compatible .reset() method for sinon-v20
  // In sinon v20, .reset() was renamed to .resetHistory()
  if (!history.replace.reset) {
    history.replace.reset = history.replace.resetHistory;
  }
  if (!history.push.reset) {
    history.push.reset = history.push.resetHistory;
  }

  return history;
};

/**
 * Input a string value into a va-text-input component.
 * @param {any} container - React Testing Library container
 * @param {string} value - string value to enter in the input field
 * @param {string} selector - string containing selector to match
 */
const inputVaTextInput = (container, value, selector = 'va-text-input') => {
  const vaTextInput = $(selector, container);
  if (!vaTextInput) throw new Error(`Element not found: ${selector}`);

  // set the value on the component instance
  vaTextInput.value = value;

  // create and dispatch a native 'input' event
  const event = new container.ownerDocument.defaultView.InputEvent('input', {
    bubbles: true,
    composed: true,
    data: value,
  });

  vaTextInput.dispatchEvent(event);
};

/**
 * Select a checkbox within a given group
 * @param {object} checkboxGroup - element containing the group
 * @param {string} keyName - unique key
 */
const checkVaCheckbox = (checkboxGroup, keyName) => {
  checkboxGroup.__events.vaChange({
    target: {
      checked: true,
      dataset: { key: keyName },
    },
    detail: { checked: true },
  });
};

/**
 * Coerces Node major version into a number and verifies its greater than 20
 */
const isNode20OrHigher =
  parseInt(process.versions.node.split('.')[0], 10) >= 20;

export {
  chai,
  checkVaCheckbox,
  createTestHistory,
  expect,
  fillDate,
  inputVaTextInput,
  mockFetch,
  mockApiRequest,
  mockMultipleApiRequests,
  mockEventListeners,
  resetFetch,
  wrapWithContext,
  wrapWithRouterContext,
  isNode20OrHigher,
};
