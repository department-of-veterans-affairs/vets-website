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
import { SECURITY_QUESTIONS } from '../../definitions/constants';
import { getEnumsFromConstants, camelCaseToSnakeAllCaps } from '../../utils';

const mockData = cloneDeep(authTypeVet.data);

const {
  defaultDefinitions,
  schema,
  uiSchema,
} = formConfig.chapters.securityInfoChapter.pages.secAnswerPage;

const testUiSchema = cloneDeep(uiSchema);
testUiSchema['ui:title'] = 'Your answer';

const pageTitle = 'Security answer';

const expectedNumberOfFields = 1;
testNumberOfFields(
  formConfig,
  schema,
  testUiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 1;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  testUiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
describe(`${pageTitle} - dynamic-field-label`, () => {
  const securityQuestionValues = getEnumsFromConstants(SECURITY_QUESTIONS);

  securityQuestionValues.forEach(questionValue => {
    it(`renders dynamic-field-label - ${questionValue}`, () => {
      mockData.securityQuestion = questionValue;

      const screen = render(
        <DefinitionTester
          definitions={defaultDefinitions}
          schema={schema}
          data={mockData}
          formData={mockData}
          uiSchema={uiSchema}
        />,
      );

      expect(screen.container.querySelector('legend > h3')).to.include.text(
        SECURITY_QUESTIONS[camelCaseToSnakeAllCaps(questionValue)],
      );
    });
  });
});
