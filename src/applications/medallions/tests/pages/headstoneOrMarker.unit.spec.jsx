import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Medallions headstoneOrMarker', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.burialInformation.pages.headstoneOrMarker;
  const mockStore = configureStore([]);
  const store = mockStore({});

  it('should render the headstone or marker page with radio options', () => {
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
    expect(form.find('va-radio-option').length).to.equal(2); // yes / no
    form.unmount();
  });
});
