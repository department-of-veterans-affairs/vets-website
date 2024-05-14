import React from 'react';

import { expect } from 'chai';
import { render } from '@testing-library/react';
import { cloneDeep } from 'lodash';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';
import authTypeVet from '../e2e/fixtures/data/authTypeVet.json';
import authTypeNonVet from '../e2e/fixtures/data/authTypeNonVet.json';
import { THIRD_PARTY_TYPES } from '../../definitions/constants';
import { getFullNameString } from '../e2e/helpers';

const mockDataPerson3rdParty = cloneDeep(authTypeVet.data);
const mockDataOrganization3rdParty = cloneDeep(authTypeNonVet.data);

const {
  defaultDefinitions,
  schema,
  uiSchema,
} = formConfig.chapters.securityInfoChapter.pages.secQuestionPage;

const pageTitle = 'Security question';

const expectedNumberOfFields = 5;
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

describe(`${pageTitle} - custom-field-label`, () => {
  it('renders custom-field-label - person 3rd-party', () => {
    mockDataPerson3rdParty.thirdPartyType = THIRD_PARTY_TYPES.PERSON;

    const screen = render(
      <DefinitionTester
        definitions={defaultDefinitions}
        schema={schema}
        data={mockDataPerson3rdParty}
        formData={mockDataPerson3rdParty}
        uiSchema={uiSchema}
      />,
    );

    expect(
      screen.container.querySelector('#root_securityQuestion-label > h3'),
    ).to.include.text(getFullNameString(mockDataPerson3rdParty.personFullName));
  });
  it('renders custom-field-label - organization 3rd-party', () => {
    mockDataOrganization3rdParty.thirdPartyType =
      THIRD_PARTY_TYPES.ORGANIZATION;

    const screen = render(
      <DefinitionTester
        definitions={defaultDefinitions}
        schema={schema}
        data={mockDataOrganization3rdParty}
        formData={mockDataOrganization3rdParty}
        uiSchema={uiSchema}
      />,
    );

    expect(screen.container.querySelector('legend h3')).to.include.text(
      mockDataOrganization3rdParty.organizationName,
    );
  });
});
