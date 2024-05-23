import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  FakeProvider,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import previousNames, {
  PreviousNameView,
} from '../../../../config/chapters/02-military-history/previousNames';

const { schema, uiSchema } = previousNames;

describe('pensions military history', () => {
  const pageTitle = 'add previous names';
  const expectedNumberOfFields = 4;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 2;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 3,
      'va-select': 1,
    },
    pageTitle,
  );

  describe('PreviousNameView', () => {
    it('should render a list view', () => {
      const { container } = render(
        <FakeProvider>
          <PreviousNameView
            formData={{
              previousFullName: {
                first: 'Jamie',
                middle: 'Andrew',
                last: 'Doe',
              },
            }}
          />
        </FakeProvider>,
      );
      const text = container.querySelector('h3');
      expect(text.innerHTML).to.equal('Jamie Andrew Doe');
    });
  });

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);
});
