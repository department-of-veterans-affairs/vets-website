import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import moment from 'moment';

import {
  DefinitionTester,
  fillData,
  fillDate,
} from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

import {
  getBranches,
  testBranches,
  clearBranches,
} from '../../utils/serviceBranches';

describe('Military history', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.militaryHistory;

  const appStateData = {
    dob: '1990-01-01',
  };

  beforeEach(() => {
    testBranches();
  });

  after(() => {
    clearBranches();
  });

  it('should render', () => {
    const branches = getBranches();
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
    // test service branch list. Add 1 for empty option
    expect(
      form.find(
        'select#root_serviceInformation_servicePeriods_0_serviceBranch option',
      ).length,
    ).to.equal(branches.length + 1);
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
      '2003-01-01',
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
      '2003-01-02',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should fail when the start date is in the future', () => {
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
      moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
    );
    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_to',
      moment()
        .add(7, 'days')
        .format('YYYY-MM-DD'),
    );

    form.find('form').simulate('submit');
    const errorMsg = form.find('.usa-input-error-message');
    expect(errorMsg.length).to.equal(1);
    expect(errorMsg.text()).to.contain('valid current or past date');
    expect(onSubmit.called).to.be.false;

    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_from',
      moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD'),
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should fail when the end date is before the start date', () => {
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
      '2020-02-05',
    );
    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_to',
      '2020-02-01',
    );

    form.find('form').simulate('submit');
    const errorMsg = form.find('.usa-input-error-message');
    expect(errorMsg.length).to.equal(1);
    expect(errorMsg.text()).to.contain('must be after start');
    expect(onSubmit.called).to.be.false;

    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_from',
      '2020-01-01',
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
