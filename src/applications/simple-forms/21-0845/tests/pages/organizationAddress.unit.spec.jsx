import React from 'react';

import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';
import authTypeVet from '../e2e/fixtures/data/authTypeVet.json';

const {
  defaultDefinitions,
  schema,
  uiSchema,
} = formConfig.chapters.disclosureInfoChapter.pages.organizationAddressPage;

const pageTitle = 'Organization’s address';

const expectedNumberOfFields = 6;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 4;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);

describe(`${pageTitle} - custom-street2-label`, () => {
  it('renders street2 custom-label', () => {
    const screen = render(
      <DefinitionTester
        definitions={defaultDefinitions}
        schema={schema}
        data={authTypeVet.data}
        formData={authTypeVet.data}
        uiSchema={uiSchema}
      />,
    );
    const countrySelect = screen.container.querySelector(
      'va-select[name="root_organizationAddress_country"]',
    );
    const countrySelectLabel = countrySelect.getAttribute('label');
    const streetInput = screen.container.querySelector(
      'va-text-input[name="root_organizationAddress_street"]',
    );
    const streetInputLabel = streetInput.getAttribute('label');
    const street2Input = screen.container.querySelector(
      'va-text-input[name="root_organizationAddress_street2"]',
    );
    const street2InputLabel = street2Input.getAttribute('label');

    expect(countrySelectLabel).to.equal('Organization’s country');
    expect(streetInputLabel).to.equal('Organization’s street address');
    expect(street2InputLabel).to.equal('Apartment or unit number');
  });
});
