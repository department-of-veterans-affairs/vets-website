import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$, $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import { additionalOfficialDetails } from '../../pages';

describe('Additional certifying official details page', () => {
  const { schema, uiSchema } = additionalOfficialDetails;

  it('Renders the page with the correct number of inputs', async () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-text-input', container).length).to.equal(7);
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(4);
    });
  });
  it('Renders the page with the correct number of required inputs after selecting a phone type in editing mode', async () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(4);
    });

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'us' },
    });

    expect($$('va-text-input[error]', container).length).to.equal(5);

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'intl' },
    });

    expect($$('va-text-input[error]', container).length).to.equal(5);
  });
  it('Renders the page with the correct required inputs after no phone selection in adding mode', () => {
    const formData = {
      'additional-certifying-official': [
        {
          additionalOfficialDetails: {
            phoneType: undefined,
          },
        },
      ],
    };

    const resultSchema = uiSchema.additionalOfficialDetails[
      'ui:options'
    ].updateSchema(formData, schema, null, 0);
    expect(
      resultSchema.properties.additionalOfficialDetails.required,
    ).to.deep.equal(['title', 'phoneType', 'emailAddress']);
  });
  it('Renders the page with the correct required inputs after selecting phone type `us` in adding mode', () => {
    const formData = {
      'additional-certifying-official': [
        {
          additionalOfficialDetails: {
            phoneType: 'us',
            phoneNumber: '1234567890',
          },
        },
      ],
    };
    const resultSchema = uiSchema.additionalOfficialDetails[
      'ui:options'
    ].updateSchema(formData, schema, null, 0);
    expect(resultSchema.required).to.deep.equal([
      'title',
      'phoneType',
      'phoneNumber',
      'emailAddress',
    ]);
  });
  it('Renders the page with the correct required inputs after selecting phone type `intl` in adding mode', () => {
    const formData = {
      'additional-certifying-official': [
        {
          additionalOfficialDetails: {
            phoneType: 'intl',
            phoneNumber: '1234567890',
          },
        },
      ],
    };

    const resultSchema = uiSchema.additionalOfficialDetails[
      'ui:options'
    ].updateSchema(formData, schema, null, 0);
    expect(resultSchema.required).to.deep.equal([
      'title',
      'phoneType',
      'internationalPhoneNumber',
      'emailAddress',
    ]);
  });
});
