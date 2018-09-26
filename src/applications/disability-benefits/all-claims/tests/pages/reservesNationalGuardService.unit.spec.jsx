import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillData,
  fillDate,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Reserve information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.reservesNationalGuardService;

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

    expect(form.find('input').length).to.equal(9);
    expect(form.find('select').length).to.equal(6);
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
    expect(form.find('.usa-input-error-message').length).to.equal(6);
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

    fillDate(
      form,
      'root_serviceInformation_reservesNationalGuardService_obligationTermOfServiceDateRange_from',
      '2010-05-05',
    );
    fillDate(
      form,
      'root_serviceInformation_reservesNationalGuardService_obligationTermOfServiceDateRange_to',
      '2012-05-05',
    );
    fillData(
      form,
      'input#root_serviceInformation_reservesNationalGuardService_unitName',
      'Unit',
    );
    fillData(
      form,
      'input#root_serviceInformation_reservesNationalGuardService_unitPhone',
      '5555555555',
    );
    fillData(
      form,
      'input#root_serviceInformation_reservesNationalGuardService_unitAddress_addressLine1',
      '123 1st st',
    );
    fillData(
      form,
      'input#root_serviceInformation_reservesNationalGuardService_unitAddress_city',
      'boston',
    );
    fillData(
      form,
      'select#root_serviceInformation_reservesNationalGuardService_unitAddress_state',
      'MA',
    );
    fillData(
      form,
      'input#root_serviceInformation_reservesNationalGuardService_unitAddress_zipCode',
      '33333',
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
