import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import {
  medicarePages,
  medicareOptions,
} from '../../../chapters/medicareInformation';

const mockStore = state => createStore(() => state);
const minimalStore = mockStore({
  form: {
    data: {},
  },
});

/**
 * Calls the depends function for a given page in the array builder.
 * Assumes the array is titled `medicare`
 * @param {Object} pages Pages object from the array builder
 * @param {String} pageName Stringified keyname of a particular page property we want to inspect
 * @returns Result of evaluating the depends function
 */
function callMedicareDependFunc(pages, pageName) {
  return pages[pageName].uiSchema.medicare.items.depends({}, 0);
}

// Basic test to make sure the depends functions don't throw errors/do return a bool.
// TODO: in future, add tests for specific depends functions with more complex logic
describe('medicarePages depends functions', () => {
  it('should compute a value', () => {
    const depPages = Object.keys(medicarePages).filter(
      page =>
        typeof medicarePages[page]?.uiSchema?.medicare?.items?.depends ===
        'function',
    );
    depPages.forEach(f => {
      const res = callMedicareDependFunc(medicarePages, f);
      expect(res).to.be.a('boolean');
      expect(res).to.not.be.undefined;
    });
  });
});

describe('medicareOptions', () => {
  describe('text.getItemName', () => {
    it('should provide fallback title when no data present', () => {
      const res = medicareOptions.text.getItemName(null, undefined, {});
      expect(res).to.equal('No participant');
    });
  });
  describe('text.cardDescription', () => {
    it('should return JSX containing an unordered list', () => {
      const res = medicareOptions.text.cardDescription({});
      const { container } = render(
        <Provider store={minimalStore}>{res}</Provider>,
      );
      expect(container.querySelector('ul')).to.not.be.undefined;
    });
  });
});
