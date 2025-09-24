import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Medallions veteranInfo1', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.veteranInfo2;

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
    expect(form.find('VaTextInput').length).to.equal(2);
    form.unmount();
  });
});
