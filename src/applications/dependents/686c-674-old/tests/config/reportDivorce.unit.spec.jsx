import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from 'platform/testing/unit/helpers';

import {
  DefinitionTester,
  fillData,
  selectRadio,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('686 report a divorce', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportDivorce.pages.formerSpouseDetails;

  const formData = {
    'view:selectable686Options': {
      reportDivorce: true,
    },
    reportDivorce: {
      location: {
        isOutsideUs: false,
      },
    },
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    expect(form.find('input').length).to.equal(12);
    form.unmount();
  });

  it('should not submit an empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        data={formData}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(8);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit a valid form without an explanation of annullment or voided marriage', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        data={formData}
      />,
    );
    // spouse name
    fillData(form, 'input#root_reportDivorce_fullName_first', 'John');
    fillData(form, 'input#root_reportDivorce_fullName_last', 'Doe');
    fillData(form, 'input#root_reportDivorce_ssn', '123211234');
    changeDropdown(form, 'select#root_reportDivorce_birthDateMonth', 1);
    changeDropdown(form, 'select#root_reportDivorce_birthDateDay', 1);
    fillData(form, 'input#root_reportDivorce_birthDateYear', '2010');

    // date of divorce
    changeDropdown(form, 'select#root_reportDivorce_dateMonth', 1);
    changeDropdown(form, 'select#root_reportDivorce_dateDay', 1);
    fillData(form, 'input#root_reportDivorce_dateYear', '2010');
    // location
    changeDropdown(form, 'select#root_reportDivorce_location_state', 'CA');
    fillData(form, 'input#root_reportDivorce_location_city', 'somewhere');
    // is void
    selectRadio(form, 'root_reportDivorce_reasonMarriageEnded', 'Divorce');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should not submit a form without an explanation of annullment or voided marriage', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        data={formData}
      />,
    );
    // spouse name
    fillData(form, 'input#root_reportDivorce_fullName_first', 'John');
    fillData(form, 'input#root_reportDivorce_fullName_last', 'Doe');
    fillData(form, 'input#root_reportDivorce_ssn', '123211234');
    changeDropdown(form, 'select#root_reportDivorce_birthDateMonth', 1);
    changeDropdown(form, 'select#root_reportDivorce_birthDateDay', 1);
    fillData(form, 'input#root_reportDivorce_birthDateYear', '2010');
    // date of divorce
    const monthDropdown = form.find('select#root_reportDivorce_dateMonth');
    const dayDropdown = form.find('select#root_reportDivorce_dateDay');
    monthDropdown.simulate('change', {
      target: { value: '1' },
    });
    dayDropdown.simulate('change', {
      target: { value: '1' },
    });
    fillData(form, 'input#root_reportDivorce_dateYear', '2010');
    // location
    changeDropdown(form, 'select#root_reportDivorce_location_state', 'CA');
    fillData(form, 'input#root_reportDivorce_location_city', 'somewhere');
    // is void
    selectRadio(form, 'root_reportDivorce_reasonMarriageEnded', 'Other');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit a form with an explanation of annullment or voided marriage', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        data={formData}
      />,
    );
    // spouse name
    fillData(form, 'input#root_reportDivorce_fullName_first', 'John');
    fillData(form, 'input#root_reportDivorce_fullName_last', 'Doe');
    fillData(form, 'input#root_reportDivorce_ssn', '123211234');
    changeDropdown(form, 'select#root_reportDivorce_birthDateMonth', 1);
    changeDropdown(form, 'select#root_reportDivorce_birthDateDay', 1);
    fillData(form, 'input#root_reportDivorce_birthDateYear', '2010');
    // date of divorce
    const monthDropdown = form.find('select#root_reportDivorce_dateMonth');
    const dayDropdown = form.find('select#root_reportDivorce_dateDay');
    monthDropdown.simulate('change', {
      target: { value: '1' },
    });
    dayDropdown.simulate('change', {
      target: { value: '1' },
    });
    fillData(form, 'input#root_reportDivorce_dateYear', '2010');
    // location
    changeDropdown(form, 'select#root_reportDivorce_location_state', 'CA');
    fillData(form, 'input#root_reportDivorce_location_city', 'somewhere');
    // is void
    selectRadio(form, 'root_reportDivorce_reasonMarriageEnded', 'Other');
    fillData(form, 'input#root_reportDivorce_explanationOfOther', 'Other');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit a form with a location outside the US', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        data={formData}
      />,
    );
    // spouse name
    fillData(form, 'input#root_reportDivorce_fullName_first', 'John');
    fillData(form, 'input#root_reportDivorce_fullName_last', 'Doe');
    fillData(form, 'input#root_reportDivorce_ssn', '123211234');
    changeDropdown(form, 'select#root_reportDivorce_birthDateMonth', 1);
    changeDropdown(form, 'select#root_reportDivorce_birthDateDay', 1);
    fillData(form, 'input#root_reportDivorce_birthDateYear', '2010');
    // date of divorce
    const monthDropdown = form.find('select#root_reportDivorce_dateMonth');
    const dayDropdown = form.find('select#root_reportDivorce_dateDay');
    monthDropdown.simulate('change', {
      target: { value: '1' },
    });
    dayDropdown.simulate('change', {
      target: { value: '1' },
    });
    fillData(form, 'input#root_reportDivorce_dateYear', '2010');
    // location
    selectCheckbox(form, 'root_reportDivorce_location_isOutsideUs', true);
    changeDropdown(form, 'select#root_reportDivorce_location_country', 'AFG');
    fillData(form, 'input#root_reportDivorce_location_city', 'somewhere');
    // is void
    selectRadio(form, 'root_reportDivorce_reasonMarriageEnded', 'Other');
    fillData(form, 'input#root_reportDivorce_explanationOfOther', 'Other');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
