import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillData,
  fillDate,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/dom';
import { daysFromToday } from '../../utils/dates/formatting';
import formConfig from '../../config/form';

describe('Reserve and National Guard Information', () => {
  const { schema, uiSchema } =
    formConfig.chapters.veteranDetails.pages.reservesNationalGuardService;

  it('should render', async () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(3);
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
      expect(form.find('.usa-input-error-message').length).to.equal(3);
      expect(onSubmit.called).to.be.false;
    });
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
        appStateData={{
          servicePeriods: [
            { serviceBranch: 'Reserves', dateRange: { from: '2008-03-12' } },
          ],
        }}
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
      '2020-05-05',
    );
    fillData(
      form,
      'input#root_serviceInformation_reservesNationalGuardService_unitName',
      'Lorem epsum',
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
  });

  it('should fail to submit when obligation end date is before start date', async () => {
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

    fillDate(
      form,
      'root_serviceInformation_reservesNationalGuardService_obligationTermOfServiceDateRange_from',
      daysFromToday(100),
    );
    fillDate(
      form,
      'root_serviceInformation_reservesNationalGuardService_obligationTermOfServiceDateRange_to',
      daysFromToday(90),
    );
    fillData(
      form,
      'input#root_serviceInformation_reservesNationalGuardService_unitName',
      'Lorem epsum',
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });
});
