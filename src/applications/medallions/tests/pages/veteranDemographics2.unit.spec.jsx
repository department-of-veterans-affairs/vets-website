import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import sinon from 'sinon';
import formConfig from '../../config/form';

describe('Medallions veteranDemographics2', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.veteranDemographics2;

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

    expect(form.find('VaCheckboxGroup').length).to.equal(1);
    expect(form.find('va-checkbox').length).to.equal(6);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            originRace: {
              NA: true,
              isWhite: true,
            },
          }}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    ``;
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
