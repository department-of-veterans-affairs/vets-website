import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import supportingDocumentsUpload from '../../pages/supportingDocumentsUpload';

const mockStore = configureStore([]);
const store = mockStore({});

describe('Medallions supportingDocumentsUpload page', () => {
  it('renders a file upload field', () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={supportingDocumentsUpload.schema}
          uiSchema={supportingDocumentsUpload.uiSchema}
          data={{}}
        />
      </Provider>,
    );
    expect(form.find('VaFileInputField').length).to.equal(1);
    form.unmount();
  });
});
