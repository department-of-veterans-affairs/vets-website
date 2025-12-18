import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  FakeProvider,
  testComponentFieldsMarkedAsRequired,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import otherNames, {
  OtherNameView,
} from '../../../../config/chapters/02-military-history/otherNames';

const { schema, uiSchema } = otherNames;

describe('pensions list of other service names', () => {
  const pageTitle = 'add other service names';
  const expectedNumberOfFields = 4;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [
      `va-text-input[label="First or given name"]`,
      `va-text-input[label="Last or family name"]`,
    ],
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

  describe('OtherNameView', () => {
    it('should render a list view', () => {
      const { container } = render(
        <FakeProvider>
          <OtherNameView
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
