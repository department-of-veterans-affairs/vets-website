import React from 'react';

import { expect } from 'chai';
import { render } from '@testing-library/react';
import { cloneDeep } from 'lodash';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';
import authTypeVet from '../e2e/fixtures/data/authTypeVet.json';

const data = cloneDeep(authTypeVet.data);
data.thirdPartyType = 'person';
const { defaultDefinitions } = formConfig;
const {
  schema,
  uiSchema,
} = formConfig.chapters.disclosureInfoChapter.pages.personAddressPage;

const pageTitle = 'Person’s address';

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
    const street2Input = screen.container.querySelector(
      'va-text-input[name="root_personAddress_street2"]',
    );
    const street2InputLabel = street2Input.getAttribute('label');

    expect(street2InputLabel).to.equal('Apartment or unit number');
  });
});
