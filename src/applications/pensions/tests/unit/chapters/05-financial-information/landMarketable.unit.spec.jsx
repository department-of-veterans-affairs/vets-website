import React from 'react';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
  FakeProvider,
  testNumberOfFieldsByType,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import landMarketable from '../../../../config/chapters/05-financial-information/landMarketable';
import { fillRadio } from '../../testHelpers/webComponents';

const { schema, uiSchema } = landMarketable;

describe('Pension: Financial information, land marketable page', () => {
  const pageTitle = 'Income and assets';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 0;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-alert': 1,
      'va-radio': 1,
    },
    pageTitle,
  );

  it('should show warning', async () => {
    const { container } = render(
      <FakeProvider>
        <DefinitionTester
          schema={schema}
          data={{ landMarketable: false }}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
        />
      </FakeProvider>,
    );
    expect($$('va-alert', container).length).to.equal(1);

    const radio = $('va-radio', container);
    expect(radio).to.exist;
    await fillRadio(radio, 'Y');
    expect($$('va-alert', container).length).to.equal(2);
  });
});
