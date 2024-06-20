import React from 'react';

import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../../../shared/tests/pages/pageTests.spec';

import formConfig from '../../config/form';
import authTypeNonVet from '../e2e/fixtures/data/authTypeNonVet.json';

const { defaultDefinitions } = formConfig;
const {
  schema,
  uiSchema,
} = formConfig.chapters.authorizerAddressChapter.pages.authAddrPage;

const pageTitle = 'Authorizer’s address';

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
        data={authTypeNonVet.data}
        formData={authTypeNonVet.data}
        uiSchema={uiSchema}
      />,
    );
    const street2Input = screen.container.querySelector(
      'va-text-input[name="root_authorizerAddress_street2"]',
    );
    const street2InputLabel = street2Input.getAttribute('label');

    expect(street2InputLabel).to.equal('Apartment or unit number');
  });
});
