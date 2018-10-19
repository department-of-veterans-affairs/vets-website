import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillDate,
  selectRadio,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Federal orders info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.federalOrders;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(2);
  });

  it('should render activation fields', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    selectRadio(
      form,
      'root_serviceInformation_reservesNationalGuardService_view:isTitle10Activated',
      'Y',
    );

    expect(form.find('input').length).to.equal(4);
    expect(form.find('select').length).to.equal(4);
  });

  it('should fail to submit when no data is filled out', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit when data filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    selectRadio(
      form,
      'root_serviceInformation_reservesNationalGuardService_view:isTitle10Activated',
      'Y',
    );
    fillDate(
      form,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_title10ActivationDate',
      '2010-05-05',
    );
    fillDate(
      form,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_anticipatedSeparationDate',
      moment()
        .add(1, 'year')
        .format('YYYY-MM-DD'),
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
