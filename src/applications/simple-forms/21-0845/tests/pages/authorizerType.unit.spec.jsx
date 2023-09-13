import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';
import authTypeNonVet from '../e2e/fixtures/data/authTypeNonVet.json';

const {
  defaultDefinitions,
  schema,
  uiSchema,
} = formConfig.chapters.authorizerTypeChapter.pages.authTypePage;

const pageTitle = 'Who’s submitting this authorization?';

const expectedNumberOfFields = 2;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 1;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);

describe(`${pageTitle} - hideFormNavProgress`, () => {
  it('renders page with header & progressbar hidden', () => {
    const screen = render(
      <DefinitionTester
        definitions={defaultDefinitions}
        schema={schema}
        data={authTypeNonVet.data}
        formData={authTypeNonVet.data}
        uiSchema={uiSchema}
      />,
    );
    expect(screen.queryAllByRole('progressbar')).to.be.empty;
    expect(screen.queryAllByTestId('navFormHeader')).to.be.empty;
  });
});
