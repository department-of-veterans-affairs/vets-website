import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import formConfig from '../../config/form';
import { additionalOfficialBenefitStatus } from '../../pages';

const mockStore = configureStore();

const mockData = {
  additionalOfficialDetails: {
    fullName: {
      first: 'John',
      last: 'Doe',
    },
  },
};

describe('Additional certifying official benefit status', () => {
  const { schema, uiSchema } = additionalOfficialBenefitStatus;

  it('Renders the page with the correct number of inputs', async () => {
    const store = mockStore({ form: { data: mockData } });
    const { container, getByRole } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
        />
        ,
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      expect($$('va-radio[error]', container).length).to.equal(1);
    });
  });
  it('should render disclaimer if yes is checked', () => {
    const store = mockStore({ form: { data: mockData } });
    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
        />
        ,
      </Provider>,
    );

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'Y' },
    });

    expect($$('va-checkbox', container).length).to.equal(1);
  });
  it('Benefits disclaimer should be hidden when hasVaEducationBenefits is false', () => {
    const formData = {
      'additional-certifying-official': [
        {
          additionalOfficialBenefitStatus: {
            hasVaEducationBenefits: false,
          },
        },
      ],
    };
    const resultSchema = uiSchema.additionalOfficialBenefitStatus[
      'view:benefitsDisclaimer'
    ]['ui:options'].hideIf(formData, 0);
    expect(resultSchema).to.equal(true);
  });
  it('Renders the page with the correct required inputs when hasVaEducationBenefits is true in adding mode', () => {
    const formData = {
      'additional-certifying-official': [
        {
          additionalOfficialBenefitStatus: {
            hasVaEducationBenefits: true,
          },
        },
      ],
    };
    const resultSchema = uiSchema.additionalOfficialBenefitStatus[
      'ui:options'
    ].updateSchema(formData, schema, null, 0);
    expect(resultSchema.required).to.deep.equal([
      'hasVaEducationBenefits',
      'view:benefitsDisclaimer',
    ]);
  });
  it('Renders the page with the correct required inputs when hasVaEducationBenefits is false in adding mode', () => {
    const formData = {
      'additional-certifying-official': [
        {
          additionalOfficialBenefitStatus: {
            hasVaEducationBenefits: false,
          },
        },
      ],
    };

    const resultSchema = uiSchema.additionalOfficialBenefitStatus[
      'ui:options'
    ].updateSchema(formData, schema, null, 0);
    expect(resultSchema.required).to.deep.equal(['hasVaEducationBenefits']);
  });
});
