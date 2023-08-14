import React from 'react';

import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';
import authTypeVet from '../e2e/fixtures/data/authTypeVet.json';

const {
  defaultDefinitions,
  schema,
  uiSchema,
} = formConfig.chapters.authorizerAddressChapter.pages.authAddrPage;

const pageTitle = 'Organization’s address';

const expectedNumberOfFields = 6;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 4;
testNumberOfErrorsOnSubmit(
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

    expect(screen.queryAllByText('Street address line 2')).to.have.lengthOf(0);
    expect(screen.queryAllByText('Apartment or unit number')).to.have.lengthOf(
      1,
    );
  });
});
