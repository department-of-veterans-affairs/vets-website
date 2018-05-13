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
const withoutStateData = _.unset('veteran.state', invalidData);
const forwardingData = _.set("veteran['view:hasForwardingAddress']", true, initialData);
const militaryData = _.set('veteran.mailingAddress.type', 'MILITARY', invalidData);
const militaryWithoutStateData = _.unset('veteran.state', militaryData);
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
  it('should render', () => {

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={invalidData}
          formData={invalidData}
          uiSchema={uiSchema}/>
      </Provider>
    ).find('PCIUAddressField');

    expect(form.find('input').length).to.equal(5);
    expect(form.find('select').length).to.equal(2);
  });
  it('should not render type', () => {

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={invalidData}
          formData={invalidData}
          uiSchema={uiSchema}/>
      </Provider>
    ).find('PCIUAddressField');

    expect(form.text()).to.not.contain('MILITARY');
  });
  it('set domestic type', () => {

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={internationalData}
          formData={internationalData}
          uiSchema={uiSchema}/>
      </Provider>
    );

    expect(form.find('PCIUAddressField').text()).to.not.contain('ZIP');
    form.find('PCIUAddressField').find('select').at(0).simulate('change', { target: { value: 'USA' } });
    form.update();
    expect(form.find('PCIUAddressField').text()).to.contain('ZIP');
  });
  it('set international type', () => {

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

    expect(form.find('PCIUAddressField').text()).to.contain('ZIP');
    form.find('PCIUAddressField').find('select').at(0).simulate('change', { target: { value: 'SPAIN' } });
    form.update();
    expect(form.find('PCIUAddressField').text()).to.not.contain('ZIP');
  });
  it('sets military type via city', () => {

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={withoutStateData}
          formData={withoutStateData}
          uiSchema={uiSchema}/>
      </Provider>
    );

    // HACK: we may need to update enzyme to enable this prop check (see enzyme issue #1153)
    // expect(form.find('PCIUAddressField').prop('formData').type).to.equal('DOMESTIC');
    expect(form.find('PCIUAddressField').text()).to.contain('Country');
    expect(form.find('select[id="root_veteran_mailingAddress_state"] option').length).to.equal(65);
    form.find('PCIUAddressField').find('input').at(3).simulate('change', { target: { value: 'APO' } });
    form.update();
    // expect(form.find('PCIUAddressField').prop('formData').type).to.equal('MILITARY');    
    expect(form.find('PCIUAddressField').text()).to.not.contain('Country');
    expect(form.find('select[id="root_veteran_mailingAddress_militaryStateCode"] option').length).to.equal(3);
  });
  it('sets military type via state', () => {

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

    // HACK: we may need to update enzyme to enable this prop check (see enzyme issue #1153)
    expect(form.find('PCIUAddressField').text()).to.contain('Country');
    expect(form.find('select[id="root_veteran_mailingAddress_state"] option').length).to.equal(65);
    expect(form.find('input[id="root_veteran_mailingAddress_city"]').props().value).to.equal('Detroit');
    // expect(form.find('PCIUAddressField').prop('formData').type).to.equal('DOMESTIC');    
    form.find('PCIUAddressField').find('select').at(1).simulate('change', { target: { value: 'AA' } });
    form.update();
    // expect(form.find('PCIUAddressField').prop('formData').type).to.equal('MILITARY');    
    expect(form.find('PCIUAddressField').text()).to.not.contain('Country');
    expect(form.find('select[id="root_veteran_mailingAddress_militaryStateCode"] option').length).to.equal(65);
    expect(form.find('input[id="root_veteran_mailingAddress_militaryPostOfficeTypeCode"]').props().value).to.equal('Detroit');
  });
  it('unsets military type via city', () => {

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={militaryWithoutStateData}
          formData={militaryWithoutStateData}
          uiSchema={uiSchema}/>
      </Provider>
    );

    // HACK: we may need to update enzyme to enable this prop check (see enzyme issue #1153)
    expect(form.find('PCIUAddressField').text()).to.not.contain('Country');
    // console.log(form.find('PCIUAddressField').debug());
    form.find('PCIUAddressField').find('input').at(3).simulate('change', { target: { value: 'FPO' } });    
    form.update();
    expect(form.find('select[id="root_veteran_mailingAddress_militaryStateCode"] option').length).to.equal(3);
    // expect(form.find('PCIUAddressField').prop('formData').type).to.equal('MILITARY');
    form.find('PCIUAddressField').find('input').at(3).simulate('change', { target: { value: 'Detroit' } });
    form.update();
    expect(form.find('PCIUAddressField').text()).to.contain('Country');
    // expect(form.find('PCIUAddressField').prop('formData').type).to.equal('DOMESTIC');
    expect(form.find('select[id="root_veteran_mailingAddress_state"] option').length).to.equal(65);
  });
  it('unsets military type via state', () => {
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

    // HACK: we may need to update enzyme to enable this prop check (see enzyme issue #1153)
    expect(form.find('PCIUAddressField').text()).to.contain('Country');
    // expect(form.find('PCIUAddressField').prop('formData').type).to.equal('DOMESTIC');    
    form.find('PCIUAddressField').find('select').at(1).simulate('change', { target: { value: 'AA' } });
    form.update();
    // expect(form.find('PCIUAddressField').prop('formData').type).to.equal('MILITARY');    
    expect(form.find('PCIUAddressField').text()).to.not.contain('Country');
    form.find('PCIUAddressField').find('select').at(0).simulate('change', { target: { value: 'WI' } });
    form.update();
    // expect(form.find('PCIUAddressField').prop('formData').type).to.equal('DOMESTIC');    
    expect(form.find('PCIUAddressField').text()).to.contain('Country');
  });
  // TODO:
  it('updates military post office type code without updating type if has military state', () => {

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={militaryData}
          formData={militaryData}
          uiSchema={uiSchema}/>
      </Provider>
    );

    // HACK: we may need to update enzyme to enable this prop check (see enzyme issue #1153)
    expect(form.find('PCIUAddressField').text()).to.not.contain('Country');
    // expect(form.find('PCIUAddressField').prop('formData').type).to.equal('MILITARY');
    form.find('input[id="root_veteran_mailingAddress_militaryPostOfficeTypeCode"]').simulate('change', { target: { value: 'Detroit' } });
    form.update();
    expect(form.find('PCIUAddressField').text()).to.not.contain('Country');
    form.find('form').simulate('submit');
    // expect(form.find('PCIUAddressField').prop('formData').type).to.equal('MILITARY');
    expect(form.find('.usa-input-error').length).to.equal(1);
  });
});
