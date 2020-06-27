import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';

chai.use(chaiAsPromised);

const expect = chai.expect;

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

let oldFetch;
/**
 * A function to mock the global fetch function and return
 * the value provided in returnVal.
 *
 * @param returnVal The value to return from the fetch promise
 * @param {boolean} [shouldResolve=true] Returns a rejected promise if this is false
 */
export function mockFetch(returnVal, shouldResolve = true) {
  // Only save global.fetch in oldFetch if global.fetch is _not_ a sinon stub.
  // Sinon stubs are objects with many properties; global.fetch has no
  // properties
  if (Object.keys(global.fetch).length === 0) {
    oldFetch = global.fetch;
  }
  global.fetch = sinon
    .stub()
    .returns(
      shouldResolve ? Promise.resolve(returnVal) : Promise.reject(returnVal),
    );
}

export function setFetchJSONResponse(stub, data = null) {
  const response = new Response();
  response.ok = true;
  if (data) {
    response.headers.set('Content-Type', 'application/json');
    response.json = () => Promise.resolve(data);
  }
  stub.resolves(response);
}

export function setFetchJSONFailure(stub, data) {
  const response = new Response(null, {
    headers: { 'content-type': ['application/json'] },
  });
  response.ok = false;
  response.json = () => Promise.resolve(data);
  stub.resolves(response);
}

export function setFetchBlobResponse(stub, data) {
  const response = new Response();
  response.ok = true;
  response.blob = () => Promise.resolve(data);
  stub.resolves(response);
}

export function setFetchBlobFailure(stub, error) {
  const response = new Response();
  response.ok = true;
  response.blob = () => Promise.reject(new Error(error));
  stub.resolves(response);
}

/**
 * Resets the fetch mock set with mockFetch
 */
export function resetFetch() {
  global.fetch.reset?.();
  if (oldFetch) {
    global.fetch = oldFetch;
  }
}

const getApiRequestObject = returnVal => ({
  headers: {
    get: () => 'application/json',
  },
  ok: true,
  json: () => Promise.resolve(returnVal),
});

/**
 * This doesn't so much _mock_ the function as it does set up the fetch to return what we
 * need it to from apiRequest(). Feel free to rename this to something more appropriate.
 *
 * @param {} returnVal The value to return from the json promise
 * @param {boolean} [shouldResolve=true] Returns a rejected promise if this is false
 */
export function mockApiRequest(returnVal, shouldResolve = true) {
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
export function mockMultipleApiRequests(responses) {
  global.fetch = sinon.stub();
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

export {
  chai,
  expect,
  fillDate,
  mockEventListeners,
  wrapWithContext,
  wrapWithRouterContext,
};
