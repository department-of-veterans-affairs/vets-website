import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillDate,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';
import { daysFromToday } from '../../utils/dates/formatting';

function getMostRecentLeapYearDate() {
  const now = new Date();
  let year = now.getFullYear();
  while (year > 1900) {
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
      const leapDay = new Date(`${year}-02-29`);
      if (leapDay < now) {
        return `${year}-02-29`;
      }
    }
    year -= 1;
  }
  // fallback
  return '2016-02-29';
}

const leapDay = getMostRecentLeapYearDate();
const separationDate = daysFromToday(90);

describe('Federal orders info', () => {
  const { schema, uiSchema } =
    formConfig.chapters.veteranDetails.pages.federalOrders;

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
      />,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
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
      daysFromToday(160), // < 180 days
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
  it('should fail to submit when activation date is in the future', async () => {
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
    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });
  it('should fail to submit when separation date is before activation', async () => {
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

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });
  it('should fail to submit when separation date is > 180 days in the future', async () => {
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
      daysFromToday(190),
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });

  it('should show error for partial activation date (YYYY-XX-XX)', async () => {
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
    // Fill only year for activation date
    form
      .find(
        'input#root_serviceInformation_reservesNationalGuardService_title10Activation_title10ActivationDateYear',
      )
      .simulate('change', { target: { value: '2022' } });
    fillDate(
      form,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_anticipatedSeparationDate',
      '2022-12-31',
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.be.greaterThan(0);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });

  it('should accept leap year activation date', async () => {
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
      leapDay,
    );
    fillDate(
      form,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_anticipatedSeparationDate',
      separationDate,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      const errorNodes = form.find('.usa-input-error-message');
      expect(errorNodes.length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
  });

  it('should show error if only activation date is filled', async () => {
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
      '2022-01-01',
    );
    // Do not fill separation date

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.be.greaterThan(0);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });

  it('should show error if only separation date is filled', async () => {
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
    // Do not fill activation date
    fillDate(
      form,
      'root_serviceInformation_reservesNationalGuardService_title10Activation_anticipatedSeparationDate',
      '2022-12-31',
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.be.greaterThan(0);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });

  it('should show error if both dates are null/undefined', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{
          serviceInformation: {
            reservesNationalGuardService: {
              title10Activation: {
                title10ActivationDate: null,
                anticipatedSeparationDate: undefined,
              },
            },
          },
        }}
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

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.be.greaterThan(0);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });
});
