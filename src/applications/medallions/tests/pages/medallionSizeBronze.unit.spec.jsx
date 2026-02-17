import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Medallions medallionSizeBronze', () => {
  const { schema, uiSchema } =
    formConfig.chapters.typeOfRequest.pages.medallionSizeBronze;

  const mockStore = configureStore([]);
  const store = mockStore({});

  it('should render', () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );
    expect(form.find('VaRadioField').length).to.equal(1);
    expect(form.find('va-radio-option').length).to.equal(3);
    form.unmount();
  });
});
