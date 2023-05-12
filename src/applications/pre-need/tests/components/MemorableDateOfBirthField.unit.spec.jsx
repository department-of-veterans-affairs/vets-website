import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import MemorableDateOfBirthField from '../../components/MemorableDateOfBirthField';
import formConfig from '../../config/form';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
describe('<MemorableDateOfBirthField>', () => {
  let store;
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantInformation;
  beforeEach(() => {
    const initialState = {
      form: {
        data: { application: { claimant: { dateOfBirth: '' } } },
      },
    };
    store = mockStore(initialState);
  });
  it('should render', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemorableDateOfBirthField />
      </Provider>,
    );
    expect(wrapper.find('va-memorable-date')).to.have.lengthOf(1);
    wrapper.unmount();
  });
  it('should be required', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
        ,
      </Provider>,
    );

    const requiredTag = form
      .find('label#root_application_claimant_dateOfBirth-label')
      .find('span');
    expect(requiredTag.exists()).to.be.true;
    form.unmount();
  });
});
