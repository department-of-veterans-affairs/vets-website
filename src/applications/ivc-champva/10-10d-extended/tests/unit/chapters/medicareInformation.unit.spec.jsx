import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import {
  medicarePages,
  medicareOptions,
  anyAppEnrolledInMedicare,
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
  it('should return array including eligible applicants', () => {
    const res = getEligibleApplicantsWithoutMedicare({
      medicare: [{}],
      applicants: [
        {
          applicantDob: '1955-01-01',
          applicantMedicareStatus: { eligibility: 'enrolled' },
        },
        {
          applicantDob: '2001-01-01', // ineligible due to age
        },
      ],
    });
    // Only one item should be returned
    expect(res).to.have.length(1);
    // Verify it's the one we wanted
    expect(res[0].applicantDob).to.equal('1955-01-01');
  });
});

describe('anyAppEnrolledInMedicare', () => {
  it('should return true if any applicant is enrolled in medicare', () => {
    const res = anyAppEnrolledInMedicare({
      medicare: [{}],
      applicants: [
        {
          applicantDob: '1955-01-01',
          applicantMedicareStatus: { eligibility: 'enrolled' },
        },
        {
          applicantDob: '2001-01-01', // ineligible due to age/not enrolled
        },
      ],
    });
    // Only one item should be returned
    expect(res).to.be.true;
  });
  it('should return false when no applicants are enrolled in medicare', () => {
    const res = anyAppEnrolledInMedicare({
      medicare: [{}],
      // two apps, neither enrolled
      applicants: [
        {
          applicantDob: '2009-01-01',
        },
        {
          applicantDob: '2001-01-01',
        },
      ],
    });
    expect(res).to.be.false;
  });
});
