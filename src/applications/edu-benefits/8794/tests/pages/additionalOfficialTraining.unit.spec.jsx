import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import formConfig from '../../config/form';
import { additionalOfficialTraining } from '../../pages';

const mockStore = configureStore();

const mockData = {
  additionalOfficialDetails: {
    fullName: {
      first: 'John',
      last: 'Doe',
    },
  },
  additionalOfficialTraining: {
    trainingExempt: false,
  },
};

// const mockData = {
//     'additional-certifying-official': [
//         {
//             additionalOfficialDetails: {
//                 fullName: {
//                     first: 'John',
//                     last: 'Doe',
//                 },
//             },
//             additionalOfficialTraining: {
//                 trainingExempt: false,
//             },
//         },
//     ],
// };

describe('Additional certifying official training page', () => {
  const { schema, uiSchema } = additionalOfficialTraining;

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

    expect($$('va-memorable-date', container).length).to.equal(1);
    expect($$('va-checkbox', container).length).to.equal(1);

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect($$('va-memorable-date[error]', container).length).to.equal(1);
    });
  });
  it('Renders the page with the correct required inputs when training exempt is false in adding mode', () => {
    const formData = {
      'additional-certifying-official': [
        {
          additionalOfficialTraining: {
            trainingExempt: false,
          },
        },
      ],
    };
    const resultSchema = uiSchema.additionalOfficialTraining[
      'ui:options'
    ].updateSchema(formData, schema, null, 0);
    expect(resultSchema.required).to.deep.equal(['trainingCompletionDate']);
  });
  it('Renders the page with the correct required inputs when training exempt is true in adding mode', () => {
    const formData = {
      'additional-certifying-official': [
        {
          additionalOfficialTraining: {
            trainingExempt: true,
          },
        },
      ],
    };

    const resultSchema = uiSchema.additionalOfficialTraining[
      'ui:options'
    ].updateSchema(formData, schema, null, 0);
    expect(resultSchema.required).to.deep.equal([]);
  });
  it('Renders the page with the correct required inputs when training exempt is true in editing mode', () => {
    const formData = {
      additionalOfficialTraining: {
        trainingExempt: true,
      },
    };

    const resultSchema = uiSchema.additionalOfficialTraining[
      'ui:options'
    ].updateSchema(formData, schema, null, 0);
    expect(resultSchema.required).to.deep.equal([]);
  });
  it('Date field should be visible when training exempt is false', () => {
    const formData = {
      'additional-certifying-official': [
        {
          additionalOfficialTraining: {
            trainingExempt: false,
          },
        },
      ],
    };
    const resultSchema = uiSchema.additionalOfficialTraining.trainingCompletionDate[
      'ui:options'
    ].hideIf(formData, 0);
    expect(resultSchema).to.equal(false);
  });
  it('User exempt label should be hidden when training exempt is false', () => {
    const formData = {
      'additional-certifying-official': [
        {
          additionalOfficialTraining: {
            trainingExempt: false,
          },
        },
      ],
    };
    const resultSchema = uiSchema.additionalOfficialTraining[
      'view:trainingExemptLabel'
    ]['ui:options'].hideIf(formData, 0);
    expect(resultSchema).to.equal(true);
  });
});
