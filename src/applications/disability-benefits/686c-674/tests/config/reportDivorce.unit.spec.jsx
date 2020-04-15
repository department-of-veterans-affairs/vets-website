import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  selectRadio,
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
    expect(form.find('input').length).to.equal(8);
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
    expect(form.find('.usa-input-error').length).to.equal(6);
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
    fillData(form, 'input#root_formerSpouseName_first', 'John');
    fillData(form, 'input#root_formerSpouseName_last', 'Doe');
    // date of divorce
    const monthDropdown = form.find('select#root_dateOfDivorceMonth');
    const dayDropdown = form.find('select#root_dateOfDivorceDay');
    monthDropdown.simulate('change', {
      target: { value: '1' },
    });
    dayDropdown.simulate('change', {
      target: { value: '1' },
    });
    fillData(form, 'input#root_dateOfDivorceYear', '2010');
    // location
    fillData(form, 'input#root_locationOfDivorce_state', 'VA');
    fillData(form, 'input#root_locationOfDivorce_city', 'somewhere');
    // is void
    selectRadio(form, 'root_isMarriageAnnulledOrVoid', 'N');
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
    fillData(form, 'input#root_formerSpouseName_first', 'John');
    fillData(form, 'input#root_formerSpouseName_last', 'Doe');
    // date of divorce
    const monthDropdown = form.find('select#root_dateOfDivorceMonth');
    const dayDropdown = form.find('select#root_dateOfDivorceDay');
    monthDropdown.simulate('change', {
      target: { value: '1' },
    });
    dayDropdown.simulate('change', {
      target: { value: '1' },
    });
    fillData(form, 'input#root_dateOfDivorceYear', '2010');
    // location
    fillData(form, 'input#root_locationOfDivorce_state', 'VA');
    fillData(form, 'input#root_locationOfDivorce_city', 'somewhere');
    // is void
    selectRadio(form, 'root_isMarriageAnnulledOrVoid', 'Y');
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
    fillData(form, 'input#root_formerSpouseName_first', 'John');
    fillData(form, 'input#root_formerSpouseName_last', 'Doe');
    // date of divorce
    const monthDropdown = form.find('select#root_dateOfDivorceMonth');
    const dayDropdown = form.find('select#root_dateOfDivorceDay');
    monthDropdown.simulate('change', {
      target: { value: '1' },
    });
    dayDropdown.simulate('change', {
      target: { value: '1' },
    });
    fillData(form, 'input#root_dateOfDivorceYear', '2010');
    // location
    fillData(form, 'input#root_locationOfDivorce_state', 'VA');
    fillData(form, 'input#root_locationOfDivorce_city', 'somewhere');
    // is void
    selectRadio(form, 'root_isMarriageAnnulledOrVoid', 'Y');
    fillData(
      form,
      'textarea#root_explanationOfAnnullmentOrVoid',
      'This is an explanation',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
