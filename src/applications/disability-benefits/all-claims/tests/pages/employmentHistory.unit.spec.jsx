import React from 'react';
import { expect } from 'chai';
import {
  DefinitionTester,
  fillDate,
} from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/dom';
import { format, subYears } from 'date-fns';
import formConfig from '../../config/form';

import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('Employment History', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.employmentHistory;

  // Helper function to create a mounted form with default data
  const createForm = () => {
    return mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:unemployabilityUploadChoice': 'answerQuestions',
        }}
        formData={{}}
      />,
    );
  };

  // Helper function to fill required address fields
  const fillRequiredAddressFields = form => {
    form
      .find(
        'select[name="root_unemployability_previousEmployers_0_employerAddress_state"]',
      )
      .simulate('change', {
        target: { value: 'CA' },
      });
    form
      .find(
        'input[name="root_unemployability_previousEmployers_0_employerAddress_zipCode"]',
      )
      .simulate('change', {
        target: { value: '94027' },
      });
  };

  it('should render', async () => {
    const form = createForm();

    expect(form.find('input').length).to.be.greaterThan(0);
    form.unmount();
  });

  it('should render with add employer button', () => {
    const form = createForm();

    expect(form.text()).to.contain('Add another employer');
    form.unmount();
  });

  it('should render with correct date range labels', () => {
    const form = createForm();

    expect(form.text()).to.contain('Dates of employment');
    expect(form.text()).to.contain('From');
    expect(form.text()).to.contain('To');
    form.unmount();
  });

  describe('previousEmployers dates dateRangeUI validation', () => {
    it('should accept valid date range where to date is after from date', async () => {
      const fromDate = format(subYears(new Date(), 2), 'yyyy-MM-dd');
      const toDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');

      const form = createForm();
      fillRequiredAddressFields(form);

      fillDate(
        form,
        'root_unemployability_previousEmployers_0_dates_from',
        fromDate,
      );
      fillDate(
        form,
        'root_unemployability_previousEmployers_0_dates_to',
        toDate,
      );

      await waitFor(() => {
        expect(form.find(ERR_MSG_CSS_CLASS)).to.have.lengthOf(0);
      });

      form.unmount();
    });

    it('should accept date range with same start and end dates', async () => {
      const sameDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');

      const form = createForm();
      fillRequiredAddressFields(form);

      fillDate(
        form,
        'root_unemployability_previousEmployers_0_dates_from',
        sameDate,
      );
      fillDate(
        form,
        'root_unemployability_previousEmployers_0_dates_to',
        sameDate,
      );

      await waitFor(() => {
        expect(form.find(ERR_MSG_CSS_CLASS)).to.have.lengthOf(0);
      });

      form.unmount();
    });

    it('should reject invalid date range where to date is before from date', async () => {
      const fromDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');
      const toDate = format(subYears(new Date(), 2), 'yyyy-MM-dd'); // Earlier date

      const form = createForm();
      fillRequiredAddressFields(form);

      fillDate(
        form,
        'root_unemployability_previousEmployers_0_dates_from',
        fromDate,
      );
      fillDate(
        form,
        'root_unemployability_previousEmployers_0_dates_to',
        toDate,
      );

      form.find('form').simulate('submit');
      form.update();

      await waitFor(() => {
        form.update();
        expect(form.find(ERR_MSG_CSS_CLASS)).to.have.lengthOf(1);
        expect(form.find(ERR_MSG_CSS_CLASS).text()).to.contain(
          'To date must be after From date',
        );
      });

      form.unmount();
    });

    it('should accept date range with only from date filled', async () => {
      const fromDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');

      const form = createForm();
      fillRequiredAddressFields(form);

      fillDate(
        form,
        'root_unemployability_previousEmployers_0_dates_from',
        fromDate,
      );

      await waitFor(() => {
        expect(form.find(ERR_MSG_CSS_CLASS)).to.have.lengthOf(0);
      });

      form.unmount();
    });

    it('should accept date range with only to date filled', async () => {
      const toDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');

      const form = createForm();
      fillRequiredAddressFields(form);

      fillDate(
        form,
        'root_unemployability_previousEmployers_0_dates_to',
        toDate,
      );

      await waitFor(() => {
        expect(form.find(ERR_MSG_CSS_CLASS)).to.have.lengthOf(0);
      });

      form.unmount();
    });

    describe('date edge cases and validation', () => {
      it('should not allow dates before 1900', async () => {
        const oldDate = '1899-12-31';

        const form = createForm();
        fillRequiredAddressFields(form);

        fillDate(
          form,
          'root_unemployability_previousEmployers_0_dates_from',
          oldDate,
        );

        form.find('form').simulate('submit');
        form.update();

        await waitFor(() => {
          form.update();
          expect(form.find(ERR_MSG_CSS_CLASS)).to.have.lengthOf(1);
          // Use the same maxYear calculation as the system
          const { maxYear } = require('platform/forms-system/src/js/helpers');
          expect(form.find(ERR_MSG_CSS_CLASS).text()).to.contain(
            `Please enter a year between 1900 and ${maxYear}`,
          );
        });

        form.unmount();
      });

      it('should handle non-leap year dates', async () => {
        const nonLeapYearDate = '2021-02-29';

        const form = createForm();
        fillRequiredAddressFields(form);

        fillDate(
          form,
          'root_unemployability_previousEmployers_0_dates_from',
          nonLeapYearDate,
        );

        form.find('form').simulate('submit');
        form.update();

        await waitFor(() => {
          form.update();
          expect(form.find(ERR_MSG_CSS_CLASS)).to.have.lengthOf(1);
          expect(form.find(ERR_MSG_CSS_CLASS).text()).to.contain(
            'Please provide a valid date',
          );
        });

        form.unmount();
      });
    });
  });
});
