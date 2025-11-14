import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import {
  medicarePages,
  medicareOptions,
  getEligibleApplicantsWithoutMedicare,
} from '../../../chapters/medicareInformation';

const mockStore = state => createStore(() => state);
const minimalStore = mockStore({
  form: {
    data: {},
  },
});

/**
 * Renders the title method contained in an array builder page.
 * Assumes the array is titled `medicare`.
 * @param {Object} pages Pages object from the array builder
 * @param {String} pageName Stringified keyname of a particular page property we want to inspect
 * @returns Boolean indicating whether or not the render produced > 0 characters
 */
function callInnerMedicareTitleFunc(pages, pageName) {
  const { container } = render(
    <Provider store={minimalStore}>
      {pages[pageName].uiSchema.medicare.items['ui:title']({})}
    </Provider>,
  );

  return container.querySelector('h3').innerHTML.length > 0;
}

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

describe('medicareInformation title functions', () => {
  it('should compute title text for each page title function in uiSchema', () => {
    const funcTitles = Object.keys(medicarePages).filter(
      page =>
        typeof medicarePages[page]?.uiSchema?.medicare?.items?.['ui:title'] ===
        'function',
    );
    funcTitles.forEach(
      page =>
        expect(callInnerMedicareTitleFunc(medicarePages, page)).to.be.true,
    );
  });

  it('should compute title text for each top-level page title function', () => {
    const funcTitles = Object.keys(medicarePages).filter(
      page => typeof medicarePages[page].title === 'function',
    );
    funcTitles.forEach(
      page => expect(medicarePages[page].title({}).length > 0).to.be.true,
    );
  });
});

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
      const res = medicareOptions.text.getItemName();
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

describe('getEligibleApplicantsWithoutMedicare', () => {
  it('should return list of applicants not assigned to a Medicare plan', () => {
    const applicantData = {
      applicants: [
        { applicantSsn: '123123123' },
        { applicantSsn: '321321321' },
      ],
      medicare: [{ medicareParticipant: '274d8b67cb72' }], // result derived from `toHash(123123123)`
    };
    const res = getEligibleApplicantsWithoutMedicare(applicantData);
    expect(res).to.have.length(1);
    expect(res[0].applicantSsn).to.eq('321321321');
  });
});
