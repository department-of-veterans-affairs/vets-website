import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';

import {
  $, // get first
  $$, // get all
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import {
  testNumberOfFieldsByType,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';

const errors =
  '.usa-input-error, va-radio[error], va-text-input[error], va-memorable-date[error]';

const marriageInfo = {
  marriages: [
    {
      spouseFullName: {
        first: 'Jane',
        last: 'Doe',
      },
    },
  ],
};

describe('Pensions spouse info', () => {
  const {
    schema,
    uiSchema,
    depends,
  } = formConfig.chapters.householdInformation.pages.spouseInfo;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={marriageInfo}
      />,
    );

    expect($('legend').textContent).to.equal('Jane Doe information');

    expect($$('va-text-input', container).length).to.equal(1);
    expect($$('va-memorable-date', container).length).to.equal(1);
    expect($$('va-radio', container).length).to.equal(2);
  });

  it('should render spouse va file number', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={marriageInfo}
      />,
    );

    // passing values in data does not set a yesNoUI correctly
    const spouseIsVeteran = $(
      'va-radio[name="root_spouseIsVeteran"]',
      container,
    );
    fireEvent(
      spouseIsVeteran,
      new CustomEvent('vaValueChange', { detail: { value: 'Y' } }),
    );

    expect($('va-text-input[name="root_spouseVaFileNumber"]', container)).to.not
      .be.null;
  });

  it('should not submit an empty form', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
        data={{}}
      />,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect($$(errors, container).length).to.equal(4);
      expect(onSubmit.called).to.be.false;
    });
  });

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, 'spouse info');

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-radio': 2,
      'va-text-input': 1,
      'va-memorable-date': 1,
    },
    'spouse info',
  );

  it('depends should return true if married', () => {
    const result = depends({ maritalStatus: 'MARRIED' });
    expect(result).to.be.true;
  });
});
