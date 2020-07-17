import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillData,
  fillDate,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Military history', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.militaryHistory;

  const appStateData = {
    dob: '1990-01-01',
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        appStateData={appStateData}
      />,
    );

    expect(form.find('input').length).to.equal(2);
    expect(form.find('select').length).to.equal(5);
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
        appStateData={appStateData}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it("should fail when the start date is before the veteran's 13th birthday", () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
        appStateData={appStateData}
      />,
    );

    fillData(
      form,
      'select#root_serviceInformation_servicePeriods_0_serviceBranch',
      'Army',
    );
    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_from',
      '2002-12-31',
    );
    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_to',
      '2012-05-05',
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_from',
      '2003-01-01',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should add another service period', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
        appStateData={appStateData}
      />,
    );

    fillData(
      form,
      'select#root_serviceInformation_servicePeriods_0_serviceBranch',
      'Army',
    );
    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_from',
      '2010-05-05',
    );
    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_to',
      '2012-05-05',
    );

    form.find('.va-growable-add-btn').simulate('click');

    expect(
      form
        .find('.va-growable-background')
        .first()
        .text(),
    ).to.contain('Army');
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
        onSubmit={onSubmit}
        appStateData={appStateData}
      />,
    );

    fillData(
      form,
      'select#root_serviceInformation_servicePeriods_0_serviceBranch',
      'Army',
    );
    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_from',
      '2010-05-05',
    );
    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_to',
      '2012-05-05',
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
