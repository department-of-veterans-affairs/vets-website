import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import {
  healthInsurancePages,
  healthInsuranceOptions,
} from '../../../chapters/healthInsuranceInformation';

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

describe('healthInsuranceOptions', () => {
  describe('text.getItemName', () => {
    it('should compute title from provider name', () => {
      const res = healthInsuranceOptions.text.getItemName({
        provider: 'bcbs',
      });
      expect(res).to.equal('bcbs');
    });
  });
});
