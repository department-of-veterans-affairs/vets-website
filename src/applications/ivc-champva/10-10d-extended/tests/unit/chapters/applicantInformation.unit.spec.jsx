import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import {
  applicantPages,
  applicantOptions,
} from '../../../chapters/applicantInformation';

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
 * @param {Object} formData optional data to provide when calculating depends result
 * @param {Number} index optional index to provide when testing array page depends
 * @returns Result of evaluating the depends function
 */
function callApplicantDependFunc(pages, pageName, formData = {}, index = 0) {
  return pages[pageName].uiSchema.applicants.items.depends(formData, index);
}

/**
 * Returns current date adjusted by deltaYears in YYYY-MM-DD formatted string
 * @param {Number} deltaYears Adjustment to apply to current year
 * @returns current date adjusted by deltaYears in YYYY-MM-DD formatted string
 */
function getDateYearsAgo(deltaYears) {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setFullYear(today.getFullYear() - deltaYears);
  // Update date to deltaYears ago (YYYY-MM-DD)
  return pastDate.toISOString().slice(0, 10);
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
describe('applicantPages depends functions', () => {
  const basicApplicantData = {
    applicants: [
      {
        applicantRelationshipToSponsor: {
          relationshipToVeteran: 'child',
        },
        applicantRelationshipOrigin: {
          relationshipToVeteran: 'adoption',
        },
      },
    ],
  };
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
  describe('page18a', () => {
    it('should return true when applicant is child and adopted', () => {
      // Example of calling a specific depends function inside array builder
      const res = applicantPages.page18a.depends(basicApplicantData, 0);
      expect(res).to.be.true;
    });
    it('should return true when applicant is stepchild', () => {
      // deep copy shared formdata as starting point
      const fd = JSON.parse(JSON.stringify(basicApplicantData));
      // Update to step child
      fd.applicants[0].applicantRelationshipOrigin.relationshipToVeteran =
        'step';
      const res = applicantPages.page18a.depends(fd, 0);
      expect(res).to.be.true;
    });
    it('should return false when applicant is not a child', () => {
      const fd = JSON.parse(JSON.stringify(basicApplicantData));
      fd.applicants[0].applicantRelationshipToSponsor.relationshipToVeteran =
        'spouse';
      const res = applicantPages.page18a.depends(fd, 0);
      expect(res).to.be.false;
    });
  });
  describe('page18d', () => {
    it('should return true when applicant is child and adopted', () => {
      // Example of calling a specific depends function inside array builder
      const res = applicantPages.page18d.depends(basicApplicantData, 0);
      expect(res).to.be.true;
    });
    it('should return false when applicant is not a child', () => {
      const fd = JSON.parse(JSON.stringify(basicApplicantData));
      fd.applicants[0].applicantRelationshipToSponsor.relationshipToVeteran =
        'spouse';
      const res = applicantPages.page18d.depends(fd, 0);
      expect(res).to.be.false;
    });
  });
  describe('page18e', () => {
    it('should return true when applicant is stepchild', () => {
      // deep copy shared formdata as starting point
      const fd = JSON.parse(JSON.stringify(basicApplicantData));
      // Update to step child
      fd.applicants[0].applicantRelationshipOrigin.relationshipToVeteran =
        'step';
      const res = applicantPages.page18e.depends(fd, 0);
      expect(res).to.be.true;
    });
    it('should return false when applicant is not a child', () => {
      const fd = JSON.parse(JSON.stringify(basicApplicantData));
      fd.applicants[0].applicantRelationshipToSponsor.relationshipToVeteran =
        'spouse';
      const res = applicantPages.page18e.depends(fd, 0);
      expect(res).to.be.false;
    });
  });
  describe('page18b1', () => {
    it('should return true when applicant is a child and between 18-23 years old', () => {
      // deep copy shared formdata as starting point
      const fd = JSON.parse(JSON.stringify(basicApplicantData));
      // Update age to 19 years old (YYYY-MM-DD)
      fd.applicants[0].applicantDob = getDateYearsAgo(19);
      const res = applicantPages.page18b1.depends(fd, 0);
      expect(res).to.be.true;
    });
    it('should return false when applicant is not between 18-23 years old', () => {
      // deep copy shared formdata as starting point
      const fd = JSON.parse(JSON.stringify(basicApplicantData));
      // Update age to 25 years old (YYYY-MM-DD)
      fd.applicants[0].applicantDob = getDateYearsAgo(25);
      const res = applicantPages.page18b1.depends(fd, 0);
      expect(res).to.be.false;
    });
    it('should return false when applicant is not a child', () => {
      const fd = JSON.parse(JSON.stringify(basicApplicantData));
      fd.applicants[0].applicantRelationshipToSponsor.relationshipToVeteran =
        'spouse';
      const res = applicantPages.page18b1.depends(fd, 0);
      expect(res).to.be.false;
    });
  });
  describe('page18b', () => {
    it('should return true when applicant is a child between 18-23 years old and enrolled in school', () => {
      // deep copy shared formdata as starting point
      const fd = JSON.parse(JSON.stringify(basicApplicantData));
      // Update age to 19 years old (YYYY-MM-DD)
      fd.applicants[0].applicantDob = getDateYearsAgo(19);
      fd.applicants[0].applicantDependentStatus = { status: 'enrolled' };
      const res = applicantPages.page18b.depends(fd, 0);
      expect(res).to.be.true;
    });
    it('should return false when applicant is not enrolled in school', () => {
      // deep copy shared formdata as starting point
      const fd = JSON.parse(JSON.stringify(basicApplicantData));
      // Valid age, but no enrollment status:
      fd.applicants[0].applicantDob = getDateYearsAgo(19);
      const res = applicantPages.page18b.depends(fd, 0);
      expect(res).to.be.false;
    });
  });
  describe('page18f4', () => {
    it('should return true when applicant is spouse and sponsor is deceased', () => {
      // deep copy shared formdata as starting point
      const fd = JSON.parse(JSON.stringify(basicApplicantData));
      fd.applicants[0].applicantRelationshipToSponsor.relationshipToVeteran =
        'spouse';
      fd.sponsorIsDeceased = true;
      const res = applicantPages.page18f4.depends(fd, 0);
      expect(res).to.be.true;
    });
    it('should return false when applicant is spouse and sponsor is alive', () => {
      // deep copy shared formdata as starting point
      const fd = JSON.parse(JSON.stringify(basicApplicantData));
      fd.applicants[0].applicantRelationshipToSponsor.relationshipToVeteran =
        'spouse';
      fd.sponsorIsDeceased = false;
      const res = applicantPages.page18f4.depends(fd, 0);
      expect(res).to.be.false;
    });
  });
  describe('page18g', () => {
    it('should return true when applicant is spouse, sponsor is deceased, and applicant remarried', () => {
      // deep copy shared formdata as starting point
      const fd = JSON.parse(JSON.stringify(basicApplicantData));
      fd.applicants[0].applicantRelationshipToSponsor.relationshipToVeteran =
        'spouse';
      fd.applicants[0].applicantRemarried = true;
      fd.sponsorIsDeceased = true;
      const res = applicantPages.page18g.depends(fd, 0);
      expect(res).to.be.true;
    });
    it('should return false when applicant has not remarried', () => {
      // deep copy shared formdata as starting point
      const fd = JSON.parse(JSON.stringify(basicApplicantData));
      fd.applicants[0].applicantRelationshipToSponsor.relationshipToVeteran =
        'spouse';
      fd.sponsorIsDeceased = true;
      fd.applicants[0].applicantRemarried = false;
      const res = applicantPages.page18g.depends(fd, 0);
      expect(res).to.be.false;
    });
  });
});

describe('applicantOptions', () => {
  describe('text.getItemName', () => {
    it('should compute title from applicant name', () => {
      const res = applicantOptions.text.getItemName({
        applicantName: { first: 'Jim', last: 'Jones' },
      });
      expect(res).to.equal('Jim Jones');
    });
  });

  describe('text.cardDescription', () => {
    it('should return JSX containing an unordered list', () => {
      const res = applicantOptions.text.cardDescription({});
      const { container } = render(
        <Provider store={minimalStore}>{res}</Provider>,
      );
      expect(container.querySelector('ul')).to.not.be.undefined;
    });
  });
});
