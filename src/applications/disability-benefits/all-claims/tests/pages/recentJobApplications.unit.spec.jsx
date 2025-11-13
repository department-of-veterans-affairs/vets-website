import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { format, subYears, addYears } from 'date-fns';
import { waitFor } from '@testing-library/dom';

import {
  DefinitionTester,
  fillData,
  fillDate,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('Recent Job Applications', () => {
  const page = formConfig.chapters.disabilities.pages.recentJobApplications;
  const { schema, uiSchema } = page;

  // Helper function to create form with job applications enabled
  const createForm = (onSubmit = sinon.spy()) => {
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(
      form,
      'root_unemployability_attemptedToObtainEmploymentSinceUnemployability',
      'Y',
    );

    return form;
  };

  // Helper function to test currentOrPastDateUI validation
  const testCurrentOrPastDateField = async (
    fieldName,
    testDate,
    shouldPass,
    expectedError = null,
  ) => {
    const onSubmit = sinon.spy();
    const form = createForm(onSubmit);

    fillDate(form, fieldName, testDate);

    form.find('form').simulate('submit');
    form.update();

    if (shouldPass) {
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    } else {
      await waitFor(() => {
        form.update();
        expect(form.find(ERR_MSG_CSS_CLASS).length).to.be.greaterThan(0);
        if (expectedError) {
          expect(form.find(ERR_MSG_CSS_CLASS).text()).to.include(expectedError);
        }
        expect(onSubmit.called).to.be.false;
      });
    }

    form.unmount();
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(2);
    expect(form.find('select').length).to.equal(0);
    form.unmount();
  });

  it('should add a recent job application', () => {
    const companyName = 'Company Name';
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(
      form,
      'root_unemployability_attemptedToObtainEmploymentSinceUnemployability',
      'Y',
    );

    fillData(
      form,
      'input#root_unemployability_appliedEmployers_0_name',
      companyName,
    );
    fillData(
      form,
      'select#root_unemployability_appliedEmployers_0_address_country',
      'USA',
    );
    fillData(
      form,
      'input#root_unemployability_appliedEmployers_0_address_addressLine1',
      '123 Street',
    );
    fillData(
      form,
      'input#root_unemployability_appliedEmployers_0_address_addressLine2',
      'Apt B',
    );
    fillData(
      form,
      'input#root_unemployability_appliedEmployers_0_address_city',
      'Testcity',
    );
    fillData(
      form,
      'select#root_unemployability_appliedEmployers_0_address_state',
      'AL',
    );
    fillData(
      form,
      'input#root_unemployability_appliedEmployers_0_address_zipCode',
      '12345-1234',
    );
    fillData(
      form,
      'input#root_unemployability_appliedEmployers_0_workType',
      'green collards',
    );
    fillDate(
      form,
      'root_unemployability_appliedEmployers_0_date',
      '2010-01-01',
    );

    form.find('.va-growable-add-btn').simulate('click');

    expect(
      form
        .find('.va-growable-background')
        .first()
        .text(),
    ).to.contain(companyName);

    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should allow submission with no recent job applications', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(
      form,
      'root_unemployability_attemptedToObtainEmploymentSinceUnemployability',
      'N',
    );
    expect(form.find('input').length).to.equal(2);
    expect(form.find('select').length).to.equal(0);

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  describe('appliedEmployers date field validation', () => {
    it('should accept current date', async () => {
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      await testCurrentOrPastDateField(
        'root_unemployability_appliedEmployers_0_date',
        currentDate,
        true,
      );
    });

    it('should accept past date', async () => {
      const pastDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');
      await testCurrentOrPastDateField(
        'root_unemployability_appliedEmployers_0_date',
        pastDate,
        true,
      );
    });

    it('should reject future date', async () => {
      const futureDate = format(addYears(new Date(), 1), 'yyyy-MM-dd');
      await testCurrentOrPastDateField(
        'root_unemployability_appliedEmployers_0_date',
        futureDate,
        false,
        'Please provide a valid current or past date',
      );
    });

    it('should reject date before 1900', async () => {
      await testCurrentOrPastDateField(
        'root_unemployability_appliedEmployers_0_date',
        '1899-12-31',
        false,
        `Please enter a year between 1900 and ${new Date().getFullYear()}`,
      );
    });

    it('should reject invalid date format', async () => {
      await testCurrentOrPastDateField(
        'root_unemployability_appliedEmployers_0_date',
        'invalid-date',
        false,
        'Please enter a valid current or past date',
      );
    });

    it('should reject non-leap year February 29', async () => {
      await testCurrentOrPastDateField(
        'root_unemployability_appliedEmployers_0_date',
        '2021-02-29',
        false,
        'Please provide a valid date',
      );
    });
  });
});
