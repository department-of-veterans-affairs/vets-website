import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import ConnectedDisabilitiesField from '../../../components/ConnectedDisabilitiesField';

const defaultStoreState = {
  form: {
    data: {
      disabilityDescription: [
        {
          disability: 'Condition A',
        },
        {
          disability: 'Condition B',
        },
      ],
    },
  },
};

const createMockStore = (state = defaultStoreState) =>
  createStore((currentState = state) => currentState);

const baseProps = {
  formData: [],
  schema: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
  uiSchema: {
    'ui:title': 'Select disabilities',
  },
  idSchema: {
    $id: 'connected-disabilities',
  },
  onChange: () => {},
};

describe('21-8940 component/ConnectedDisabilitiesField', () => {
  afterEach(() => {
    cleanup();
  });

  const renderField = (props = {}, storeState) => {
    const { container } = render(
      <Provider store={createMockStore(storeState)}>
        <ConnectedDisabilitiesField {...baseProps} {...props} />
      </Provider>,
    );
    return container.querySelector('va-checkbox-group');
  };

  it('displays the first raw error message on the checkbox group', () => {
    const checkboxGroup = renderField({
      rawErrors: ['Select at least one service-connected disability'],
    });

    expect(checkboxGroup).to.exist;
    expect(checkboxGroup.getAttribute('error')).to.equal(
      'Select at least one service-connected disability',
    );
  });

  it('falls back to nested errorSchema messages when rawErrors are missing', () => {
    const checkboxGroup = renderField({
      errorSchema: {
        minItems: {
          __errors: ['Please choose at least one disability'],
        },
      },
    });

    expect(checkboxGroup).to.exist;
    expect(checkboxGroup.getAttribute('error')).to.equal(
      'Please choose at least one disability',
    );
  });
});
