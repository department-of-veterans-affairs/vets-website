import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { add, format } from 'date-fns';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillDate,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

const formatDate = date => format(date, 'yyyy-MM-dd');
const daysFromToday = days => formatDate(add(new Date(), { days }));

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
    form.unmount();
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
    form.unmount();
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
    form.unmount();
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
        appStateData={{
          servicePeriods: [
            { serviceBranch: 'Reserves', dateRange: { from: '2008-03-12' } },
          ],
        }}
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
        .add(160, 'days') // < 180 days
        .format('YYYY-MM-DD'),
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
  it('should fail to submit when activation date is in the future', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        appStateData={{
          servicePeriods: [
            { serviceBranch: 'Reserves', dateRange: { from: '2008-03-12' } },
          ],
        }}
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
      daysFromToday(10),
    );
    fillDate(
      form,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_anticipatedSeparationDate',
      daysFromToday(20),
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should fail to submit when separation date is before activation', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        appStateData={{
          servicePeriods: [
            { serviceBranch: 'Reserves', dateRange: { from: '2008-03-12' } },
          ],
        }}
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
      daysFromToday(-10),
    );
    fillDate(
      form,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_anticipatedSeparationDate',
      daysFromToday(-20),
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should fail to submit when separation date is > 180 days in the future', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        appStateData={{
          servicePeriods: [
            { serviceBranch: 'Reserves', dateRange: { from: '2008-03-12' } },
          ],
        }}
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
      moment()
        .add(-10, 'days')
        .format('YYYY-MM-DD'),
    );
    fillDate(
      form,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_anticipatedSeparationDate',
      moment()
        .add(190, 'days')
        .format('YYYY-MM-DD'),
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
