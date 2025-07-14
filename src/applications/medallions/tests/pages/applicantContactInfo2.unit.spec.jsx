import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import applicantContactInfo2 from '../../pages/applicantContactInfo2';

const mockStore = configureStore([]);
const store = mockStore({});

describe('Medallions applicantContactInfo2 page', () => {
  it('renders the form and fields', () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={applicantContactInfo2.schema}
          uiSchema={applicantContactInfo2.uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect(form.find('va-text-input').length).to.equal(2);
    form.unmount();
  });
});
