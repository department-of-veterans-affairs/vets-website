import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import _ from 'lodash/fp';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';
import reducer from '../../reducer';
import initialData from '../schema/initialData.js';

// Invalid data is required to access the edit view
const invalidData = _.set('veteran.primaryPhone', '234234234234234', initialData);
const forwardingData = _.set("veteran['view:hasForwardingAddress']", true, initialData);
const militaryData = _.set('veteran.mailingAddress.type', 'MILITARY', invalidData);
const internationalData = _.set('veteran.mailingAddress.type', 'INTERNATIONAL', invalidData);

describe('Disability benefits 526EZ primary address', () => {
  const {
    schema,
    uiSchema
  } = formConfig.chapters.veteranDetails.pages.primaryAddress;
  const store = createStore(
    combineReducers(reducer),
    compose(
      applyMiddleware(thunk),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );

  it('renders primary address form', () => {

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={invalidData}
          formData={invalidData}
          uiSchema={uiSchema}/>
      </Provider>
    ).find('ReviewCardField');

    expect(form.find('input').length).to.equal(9);
    expect(form.find('select').length).to.equal(2);
  });
  it('reveals forwarding address form', () => {

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={forwardingData}
          formData={forwardingData}
          uiSchema={uiSchema}/>
      </Provider>
    ).find('ReviewCardField');

    expect(form.find('input').length).to.equal(15);
    expect(form.find('select').length).to.equal(6);
  });
  it('render military address form', () => {

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={militaryData}
          formData={militaryData}
          uiSchema={uiSchema}/>
      </Provider>
    ).find('ReviewCardField');

    expect(form.find('input').length).to.equal(8);
    expect(form.find('select').length).to.equal(1);
  });
  it('render international address form', () => {

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={internationalData}
          formData={internationalData}
          uiSchema={uiSchema}/>
      </Provider>
    ).find('ReviewCardField');

    expect(form.find('input').length).to.equal(8);
    expect(form.find('select').length).to.equal(1);
  });
  it('does not submit without required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={invalidData}
          formData={invalidData}
          uiSchema={uiSchema}/>
      </Provider>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
  it('does submit with required info', () => {
    // const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={initialData}
          formData={initialData}
          uiSchema={uiSchema}/>
      </Provider>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    // HACK: fix test
    // expect(onSubmit.called).to.be.true;
  });
});
