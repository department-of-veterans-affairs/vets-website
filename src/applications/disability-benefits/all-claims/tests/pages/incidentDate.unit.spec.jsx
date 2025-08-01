import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { format, subYears, addYears } from 'date-fns';

import {
  DefinitionTester,
  fillDate,
} from 'platform/testing/unit/schemaform-utils';
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';

describe('781 Incident Date', () => {
  const page = formConfig.chapters.disabilities.pages.incidentDate0;
  const { schema, uiSchema, arrayPath } = page;

  it('should render', async () => {
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(1);
    expect(form.find('select').length).to.equal(2);
    form.unmount();
  });

  it('should fill in incident date', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    fillDate(form, 'root_incident0_incidentDate', '2016-07-10');
    await waitFor(() => {
      form.find('form').simulate('submit');

      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
  });
  it('should allow parttially filled in incident date', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    fillDate(form, 'root_incident0_incidentDate', '2016-07-XX');
    await waitFor(() => {
      form.find('form').simulate('submit');

      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
  });
  it('should allow submission if no incident date submitted', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
  });

  describe('incidentDate field validation', () => {
    const testCurrentOrPastDateField = (
      testDate,
      shouldPass,
      expectedError = '',
    ) => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          onSubmit={onSubmit}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
        />,
      );

      fillDate(form, 'root_incident0_incidentDate', testDate);
      form.find('form').simulate('submit');

      if (shouldPass) {
        expect(form.find('.usa-input-error-message').length).to.equal(0);
        expect(onSubmit.called).to.be.true;
      } else {
        expect(form.find('.usa-input-error-message').text()).to.include(
          expectedError,
        );
        expect(onSubmit.called).to.be.false;
      }
      form.unmount();
    };

    it('should accept current date', () => {
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      testCurrentOrPastDateField(currentDate, true);
    });

    it('should accept past date', () => {
      const pastDate = format(subYears(new Date(), 5), 'yyyy-MM-dd');
      testCurrentOrPastDateField(pastDate, true);
    });

    it('should reject future date', () => {
      const futureDate = format(addYears(new Date(), 1), 'yyyy-MM-dd');
      testCurrentOrPastDateField(
        futureDate,
        false,
        'Please provide a valid current or past date',
      );
    });

    it('should reject date before 1900', () => {
      testCurrentOrPastDateField(
        '1899-12-31',
        false,
        `Please enter a year between 1900 and ${new Date().getFullYear()}`,
      );
    });

    it('should reject date after 2069', () => {
      testCurrentOrPastDateField(
        '2070-01-01',
        false,
        `Please enter a year between 1900 and ${new Date().getFullYear()}`,
      );
    });

    it('should reject invalid date format', () => {
      testCurrentOrPastDateField(
        'invalid-date',
        false,
        'Please enter a valid current or past date',
      );
    });

    it('should reject non-leap year February 29', () => {
      testCurrentOrPastDateField(
        '2021-02-29',
        false,
        'Please provide a valid date',
      );
    });

    it('should accept leap year February 29', () => {
      testCurrentOrPastDateField('2020-02-29', true);
    });
  });
});
