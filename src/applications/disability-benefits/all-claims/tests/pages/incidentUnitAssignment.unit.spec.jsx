import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import {
  DefinitionTester,
  fillDate,
  fillData,
} from 'platform/testing/unit/schemaform-utils';
import { waitFor } from '@testing-library/dom';
import { ERR_MSG_CSS_CLASS } from '../../constants';

import formConfig from '../../config/form';

describe('781 Unit Assignment Details', () => {
  const page = formConfig.chapters.disabilities.pages.incidentUnitAssignment0;
  const { schema, uiSchema } = page;

  it('should render', async () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(3);
    expect(form.find('select').length).to.equal(4);
    form.unmount();
  });

  it('should fill in unit assignment details', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    fillData(form, 'input#root_incident0_unitAssigned', '21st Airborne');
    fillDate(form, 'root_incident0_unitAssignedDates_from', '2016-07-10');
    fillDate(form, 'root_incident0_unitAssignedDates_to', '2017-06-12');

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
  });

  it('should allow submission if no assigned unit details are submitted', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
  });

  describe('unitAssignedDates field validation', () => {
    const addUnitAssignment = (from, to) => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          onSubmit={onSubmit}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
        />,
      );
      if (from) fillDate(form, 'root_incident0_unitAssignedDates_from', from);
      if (to) fillDate(form, 'root_incident0_unitAssignedDates_to', to);
      form.find('form').simulate('submit');
      return { form, onSubmit };
    };

    it('should accept valid date range', async () => {
      const { form, onSubmit } = addUnitAssignment('2016-07-10', '2017-06-12');
      await waitFor(() => {
        expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
        expect(onSubmit.called).to.be.true;
      });
      form.unmount();
    });

    it('should reject invalid date range (to before from)', async () => {
      const { form, onSubmit } = addUnitAssignment('2017-06-12', '2016-07-10');
      await waitFor(() => {
        expect(form.find(ERR_MSG_CSS_CLASS).text()).to.include(
          'The date must be after Start date',
        );
        expect(onSubmit.called).to.be.false;
      });
      form.unmount();
    });

    it('should reject equal from/to dates', async () => {
      const { form, onSubmit } = addUnitAssignment('2016-07-10', '2016-07-10');
      await waitFor(() => {
        expect(form.find(ERR_MSG_CSS_CLASS).text()).to.include(
          'The date must be after Start date',
        );
        expect(onSubmit.called).to.be.false;
      });
      form.unmount();
    });

    it('should accept only from date filled', async () => {
      const { form, onSubmit } = addUnitAssignment('2016-07-10', '');
      await waitFor(() => {
        expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
        expect(onSubmit.called).to.be.true;
      });
      form.unmount();
    });

    it('should accept only to date filled', async () => {
      const { form, onSubmit } = addUnitAssignment('', '2017-06-12');
      await waitFor(() => {
        expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
        expect(onSubmit.called).to.be.true;
      });
      form.unmount();
    });

    it('should reject date before 1900', async () => {
      const { form, onSubmit } = addUnitAssignment('1899-12-31', '2017-06-12');
      await waitFor(() => {
        expect(form.find(ERR_MSG_CSS_CLASS).text()).to.include(
          'Please enter a year between 1900 and 2069',
        );
        expect(onSubmit.called).to.be.false;
      });
      form.unmount();
    });

    it('should reject date after 2069', async () => {
      const { form, onSubmit } = addUnitAssignment('2016-07-10', '2070-01-01');
      await waitFor(() => {
        expect(form.find(ERR_MSG_CSS_CLASS).text()).to.include(
          'Please enter a year between 1900 and 2069',
        );
        expect(onSubmit.called).to.be.false;
      });
      form.unmount();
    });

    it('should reject invalid date format', async () => {
      const { form, onSubmit } = addUnitAssignment(
        'invalid-date',
        '2017-06-12',
      );
      await waitFor(() => {
        expect(
          form
            .find(ERR_MSG_CSS_CLASS)
            .first()
            .text(),
        ).to.include('Please enter a year between 1900 and 2069');
        expect(onSubmit.called).to.be.false;
      });
      form.unmount();
    });

    it('should reject non-leap year February 29', async () => {
      const { form, onSubmit } = addUnitAssignment('2021-02-29', '2021-12-01');
      await waitFor(() => {
        expect(
          form
            .find(ERR_MSG_CSS_CLASS)
            .first()
            .text(),
        ).to.include('Please provide a valid date');
        expect(onSubmit.called).to.be.false;
      });
      form.unmount();
    });

    it('should accept leap year February 29', async () => {
      const { form, onSubmit } = addUnitAssignment('2020-02-29', '2020-12-01');
      await waitFor(() => {
        expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
        expect(onSubmit.called).to.be.true;
      });
      form.unmount();
    });
  });
});
