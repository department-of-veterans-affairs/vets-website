import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Medallions applicantRelationToVetOrg', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantRelationToVetOrg;

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
    expect(form.find('va-text-input').length).to.equal(1);
    form.unmount();
  });
});
