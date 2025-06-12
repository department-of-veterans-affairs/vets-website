import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { applicantPages } from '../../../chapters/applicantInformation';

const mockStore = state => createStore(() => state);
const minimalStore = mockStore({
  form: {
    data: {},
  },
});

/**
 * Renders the title method contained in an array builder page.
 * Assumes the array is titled `applicants`.
 * @param {Object} pages Pages object from the array builder
 * @param {String} pageName Stringified keyname of a particular page property we want to inspect
 * @returns Boolean indicating whether or not the render produced > 0 characters
 */
function callInnerApplicantTitleFunc(pages, pageName) {
  const { container } = render(
    <Provider store={minimalStore}>
      {pages[pageName].uiSchema.applicants.items['ui:title']({
        formData: {},
        formContext: {},
      })}
    </Provider>,
  );

  return container.querySelector('h3').innerHTML.length > 0;
}

/**
 * Calls the depends function for a given page in the array builder.
 * Assumes the array is titled `applicants`
 * @param {Object} pages Pages object from the array builder
 * @param {String} pageName Stringified keyname of a particular page property we want to inspect
 * @returns Result of evaluating the depends function
 */
function callApplicantDependFunc(pages, pageName) {
  return pages[pageName].uiSchema.applicants.items.depends({}, 0);
}

describe('applicantPages title functions', () => {
  it('should compute title text for each page title function in uiSchema', () => {
    const funcTitles = Object.keys(applicantPages).filter(
      page =>
        page.includes('page') &&
        typeof applicantPages[page].uiSchema.applicants.items['ui:title'] ===
          'function',
    );
    funcTitles.forEach(
      page =>
        expect(callInnerApplicantTitleFunc(applicantPages, page)).to.be.true,
    );
  });

  it('should compute title text for each top-level page title function', () => {
    const funcTitles = Object.keys(applicantPages).filter(
      page =>
        page.includes('page') &&
        typeof applicantPages[page].title === 'function',
    );
    funcTitles.forEach(
      page => expect(applicantPages[page].title({}).length > 0).to.be.true,
    );
  });
});

// Basic test to make sure the depends functions don't throw errors/do return a bool.
// TODO: in future, add tests for specific depends functions with more complex logic
describe('applicantPages depends functions', () => {
  it('should compute a value', () => {
    const depPages = Object.keys(applicantPages).filter(
      page =>
        page.includes('page') &&
        typeof applicantPages[page].uiSchema.applicants.items.depends ===
          'function',
    );
    depPages.forEach(f => {
      const res = callApplicantDependFunc(applicantPages, f);
      expect(res).to.be.a('boolean');
      expect(res).to.not.be.undefined;
    });
  });
});
