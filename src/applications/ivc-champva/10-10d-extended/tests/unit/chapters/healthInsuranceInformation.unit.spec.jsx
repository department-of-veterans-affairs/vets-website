import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import {
  healthInsurancePages,
  generateParticipantNames,
  healthInsuranceOptions,
} from '../../../chapters/healthInsuranceInformation';
import { selectHealthcareParticipantsOnGoForward } from '../../../chapters/SelectHealthcareParticipantsPage';

const mockStore = state => createStore(() => state);
const minimalStore = mockStore({
  form: {
    data: {},
  },
});

/**
 * Renders the title method contained in an array builder page.
 * Assumes the array is titled `healthInsurance`.
 * @param {Object} pages Pages object from the array builder
 * @param {String} pageName Stringified keyname of a particular page property we want to inspect
 * @returns Boolean indicating whether or not the render produced > 0 characters
 */
function callInnerHealthInsuranceTitleFunc(pages, pageName) {
  const { container } = render(
    <Provider store={minimalStore}>
      {pages[pageName].uiSchema.healthInsurance.items['ui:title']({})}
    </Provider>,
  );

  return container.querySelector('h3').innerHTML.length > 0;
}

/**
 * Calls the depends function for a given page in the array builder.
 * Assumes the array is titled `healthInsurance`
 * @param {Object} pages Pages object from the array builder
 * @param {String} pageName Stringified keyname of a particular page property we want to inspect
 * @returns Result of evaluating the depends function
 */
function callHealthInsuranceDependFunc(pages, pageName) {
  return pages[pageName].uiSchema.healthInsurance.items.depends({}, 0);
}

describe('healthInsurancePages title functions', () => {
  it('should compute title text for each page title function in uiSchema', () => {
    const funcTitles = Object.keys(healthInsurancePages).filter(
      page =>
        typeof healthInsurancePages[page]?.uiSchema?.healthInsurance?.items[
          'ui:title'
        ] === 'function',
    );
    funcTitles.forEach(
      page =>
        expect(callInnerHealthInsuranceTitleFunc(healthInsurancePages, page)).to
          .be.true,
    );
  });

  it('should compute title text for each top-level page title function', () => {
    const funcTitles = Object.keys(healthInsurancePages).filter(
      page =>
        page.includes('page') &&
        typeof healthInsurancePages[page].title === 'function',
    );
    funcTitles.forEach(
      page =>
        expect(healthInsurancePages[page].title({}).length > 0).to.be.true,
    );
  });
});

// Basic test to make sure the depends functions don't throw errors/do return a bool.
// TODO: in future, add tests for specific depends functions with more complex logic
describe('healthInsurancePages depends functions', () => {
  it('should compute a value', () => {
    const depPages = Object.keys(healthInsurancePages).filter(
      page =>
        page.includes('page') &&
        typeof healthInsurancePages[page].uiSchema.healthInsurance.items
          .depends === 'function',
    );
    depPages.forEach(f => {
      const res = callHealthInsuranceDependFunc(healthInsurancePages, f);
      expect(res).to.be.a('boolean');
      expect(res).to.not.be.undefined;
    });
  });

  // Example of calling a specific depends function inside array builder
  it('medigapType depends fn should return true if insurance type is "medigap"', () => {
    expect(
      healthInsurancePages.medigapType.depends(
        {
          healthInsurance: [
            {
              insuranceType: 'medigap',
            },
          ],
        },
        0,
      ),
    ).to.be.true;
  });
});

describe('selectHealthcareParticipantsOnGoForward', () => {
  const baseData = {
    applicants: [
      {
        applicantName: { first: 'Bruce', last: 'Wayne' },
        applicantSsn: '123123123',
      },
      {
        applicantName: { first: 'Clark', last: 'Kent' },
        applicantSsn: '321321321',
      },
      {
        applicantName: { first: 'James', last: 'Gordon' },
        applicantSsn: '543543543',
      },
    ],
    healthInsurance: [{ provider: 'Blue Cross' }, { provider: 'Cigna' }],
  };
  it('should use setFormData to add applicants to each insurance plan', () => {
    let fullData = JSON.parse(JSON.stringify(baseData));
    selectHealthcareParticipantsOnGoForward({
      fullData,
      setFormData: newData => {
        fullData = newData;
      },
    });
    expect(fullData.healthInsurance[0]['view:applicantObjects'].length).to.eq(
      baseData.applicants.length,
    );
  });
});

describe('generateParticipantNames', () => {
  const baseData = {
    healthInsurance: [
      {
        // Checklist of applicants that belong on this insurance plan
        // Keys are a hash generated from applicant information (see `toHash` function)
        healthcareParticipants: {
          '274d8b67cb72': undefined,
          '28da4d8d02f2': undefined,
          '2a74b32b81f4': undefined,
        },
        'view:applicantObjects': [
          {
            applicantName: { first: 'Bruce', last: 'Wayne' },
            applicantSsn: '123123123',
          },
          {
            applicantName: { first: 'Clark', last: 'Kent' },
            applicantSsn: '321321321',
          },
          {
            applicantName: { first: 'James', last: 'Gordon' },
            applicantSsn: '543543543',
          },
        ],
      },
    ],
  };
  it('should produce a list of applicant names matching those selected', () => {
    const formData = JSON.parse(JSON.stringify(baseData));
    // Associate two of the three applicants with this insurance policy
    formData.healthInsurance[0].healthcareParticipants['274d8b67cb72'] = true;
    formData.healthInsurance[0].healthcareParticipants['2a74b32b81f4'] = true;
    expect(generateParticipantNames(formData.healthInsurance[0])).to.eq(
      'Bruce Wayne, James Gordon',
    );
  });
  it('should produce a default value when no applicants are selected', () => {
    expect(generateParticipantNames(baseData.healthInsurance[0])).to.eq(
      'No members specified',
    );
  });
  it('should produce a default value when no applicants are available', () => {
    const formData = JSON.parse(JSON.stringify(baseData));
    delete formData.healthInsurance[0].healthcareParticipants;
    delete formData.healthInsurance[0]['view:applicantObjects'];
    expect(generateParticipantNames(formData.healthInsurance[0])).to.eq(
      'No members specified',
    );
  });
  it('should produce a default value when no arguments are passed', () => {
    expect(generateParticipantNames()).to.eq('No participants');
  });
});

describe('healthInsuranceOptions', () => {
  describe('text.getItemName', () => {
    it('should compute title from provider name', () => {
      const res = healthInsuranceOptions.text.getItemName({
        provider: 'bcbs',
      });
      expect(res).to.equal('bcbs');
    });
  });

  describe('text.cardDescription', () => {
    it('should return JSX containing an unordered list', () => {
      const res = healthInsuranceOptions.text.cardDescription({});
      const { container } = render(
        <Provider store={minimalStore}>{res}</Provider>,
      );
      expect(container.querySelector('ul')).to.not.be.undefined;
    });
  });
});
