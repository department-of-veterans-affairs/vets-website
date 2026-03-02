import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import ConnectedDisabilitiesField from '../../../components/ConnectedDisabilitiesField';

const createMockStore = ({ disabilityDescription }) =>
  createStore(() => ({
    form: {
      data: {
        disabilityDescription,
      },
    },
  }));

describe('21-8940 component/ConnectedDisabilitiesField integration', () => {
  const schema = {
    type: 'object',
    properties: {
      connectedDisabilities: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'string',
          enum: ['Condition A', 'Condition B'],
        },
      },
    },
  };

  const uiSchema = {
    connectedDisabilities: {
      'ui:title':
        'Please select the service-connected disabilities this doctor treated you for.',
      'ui:field': ConnectedDisabilitiesField,
      'ui:errorMessages': {
        minItems: 'Select at least one service-connected disability',
      },
    },
  };

  const formData = {
    connectedDisabilities: [],
  };

  it('adds an error attribute after submit with no selections', async () => {
    const store = createMockStore({
      disabilityDescription: [
        { disability: 'Condition A' },
        { disability: 'Condition B' },
      ],
    });

    const { container } = render(
      <Provider store={store}>
        <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />
      </Provider>,
    );

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      const checkboxGroup = container.querySelector('va-checkbox-group');
      expect(checkboxGroup).to.exist;
      expect(checkboxGroup.getAttribute('error')).to.equal(
        'Select at least one service-connected disability',
      );
    });
  });
});
