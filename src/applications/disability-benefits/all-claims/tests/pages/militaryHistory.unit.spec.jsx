import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { waitFor } from '@testing-library/dom';

import {
  DefinitionTester,
  fillData,
  fillDate,
} from 'platform/testing/unit/schemaform-utils';
import { daysFromToday } from '../../utils/dates/formatting';
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

  it('should fail to submit when no data is filled out', async () => {
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

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(3);
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });
  });

  it("should fail when the start date is before the veteran's 13th birthday", async () => {
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

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_from',
      '2003-01-02',
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
      form.unmount();
    });
  });

  it('should fail when the start date is in the future', async () => {
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
      daysFromToday(1),
    );
    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_to',
      daysFromToday(7),
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      const errorMsg = form.find('.usa-input-error-message');
      expect(errorMsg.length).to.equal(1);
      expect(errorMsg.text()).to.contain('valid current or past date');
      expect(onSubmit.called).to.be.false;
    });

    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_from',
      daysFromToday(-1),
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
      form.unmount();
    });
  });

  it('should fail when the end date is before the start date', async () => {
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

    await waitFor(() => {
      form.find('form').simulate('submit');
      const errorMsg = form.find('.usa-input-error-message');
      expect(errorMsg.length).to.equal(1);
      expect(errorMsg.text()).to.contain('must be after start');
      expect(onSubmit.called).to.be.false;
    });

    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_from',
      '2020-01-01',
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
      form.unmount();
    });
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

  it('should submit when data filled in', async () => {
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

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
      form.unmount();
    });
  });

  it('should show an error for partial from date (YYYY-XX-XX)', async () => {
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
    fillData(
      form,
      'input#root_serviceInformation_servicePeriods_0_dateRange_fromYear',
      '2020',
    );
    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_to',
      '2021-01-01',
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.be.greaterThan(0);
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });
  });

  it('should accept a valid leap year date', async () => {
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
      '2020-02-29',
    );
    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_to',
      '2021-01-01',
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
      form.unmount();
    });
  });

  it('should show an error if only from date is filled', async () => {
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
      '2010-01-01',
    );
    // Do not fill to date

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.be.greaterThan(0);
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });
  });

  it('should show an error if only to date is filled', async () => {
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
    // Do not fill from date
    fillDate(
      form,
      'root_serviceInformation_servicePeriods_0_dateRange_to',
      '2012-01-01',
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.be.greaterThan(0);
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });
  });

  it('should show an error if from and to dates are null/undefined', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{
          serviceInformation: {
            servicePeriods: [
              {
                serviceBranch: 'Army',
                dateRange: { from: null, to: undefined },
              },
            ],
          },
        }}
        onSubmit={onSubmit}
        appStateData={appStateData}
      />,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.be.greaterThan(0);
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });
  });
});
