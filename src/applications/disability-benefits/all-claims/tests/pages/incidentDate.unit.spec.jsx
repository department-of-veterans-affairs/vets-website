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
    form.find('form').simulate('submit');

    await waitFor(() => {
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
    const testCurrentOrPastDateField = async (
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
      form.update();

      if (shouldPass) {
        expect(form.find('.usa-input-error-message').length).to.equal(0);
        expect(onSubmit.called).to.be.true;
      } else {
        await waitFor(() => {
          form.update();
          expect(form.find('.usa-input-error-message').text()).to.include(
            expectedError,
          );
          expect(onSubmit.called).to.be.false;
        });
      }
      form.unmount();
    };

    it('should accept current date', async () => {
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      await testCurrentOrPastDateField(currentDate, true);
    });

    it('should accept past date', async () => {
      const pastDate = format(subYears(new Date(), 5), 'yyyy-MM-dd');
      await testCurrentOrPastDateField(pastDate, true);
    });

    it('should reject future date', async () => {
      const futureDate = format(addYears(new Date(), 1), 'yyyy-MM-dd');
      await testCurrentOrPastDateField(
        futureDate,
        false,
        'Please provide a valid current or past date',
      );
    });

    it('should reject date before 1900', async () => {
      await testCurrentOrPastDateField(
        '1899-12-31',
        false,
        `Please enter a year between 1900 and ${new Date().getFullYear()}`,
      );
    });

    it('should reject invalid date format', async () => {
      await testCurrentOrPastDateField(
        'invalid-date',
        false,
        'Please enter a valid current or past date',
      );
    });

    it('should reject non-leap year February 29', async () => {
      await testCurrentOrPastDateField(
        '2021-02-29',
        false,
        'Please provide a valid date',
      );
    });

    it('should accept leap year February 29', async () => {
      await testCurrentOrPastDateField('2020-02-29', true);
    });
  });
});
