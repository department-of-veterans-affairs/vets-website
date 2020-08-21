import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from '../helpers/index.js';
import {
  DefinitionTester,
  fillData,
  selectRadio,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('686 spouse marriage history details', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.spouseMarriageHistoryDetails;

  const formData = {
    'view:selectable686Options': {
      addSpouse: true,
    },
    spouseWasMarriedBefore: true,
    spouseMarriageHistory: [
      {
        fullName: {
          first: 'Jane',
          last: 'Doe',
        },
      },
    ],
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        arrayPath={arrayPath}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(form.find('input').length).to.equal(9);
    form.unmount();
  });

  it('should not submit without required fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        arrayPath={arrayPath}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(7);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with required fields filled', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        arrayPath={arrayPath}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    // Date marriage start
    changeDropdown(form, 'select#root_startDateMonth', 1);
    changeDropdown(form, 'select#root_startDateDay', 1);
    fillData(form, 'input#root_startDateYear', '2010');
    // Marriage start location
    changeDropdown(form, 'select#root_startLocation_state', 'CA');
    fillData(form, 'input#root_startLocation_city', 'Outhere');
    // Reason marriage ended
    selectRadio(form, 'root_reasonMarriageEnded', 'Divorce');
    // Date marriage ended
    changeDropdown(form, 'select#root_endDateMonth', 1);
    changeDropdown(form, 'select#root_endDateDay', 1);
    fillData(form, 'input#root_endDateYear', '2011');
    // Marriage end location
    changeDropdown(form, 'select#root_endLocation_state', 'CA');
    fillData(form, 'input#root_endLocation_city', 'Not here');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with required fields filled and separation reason OTHER', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        arrayPath={arrayPath}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    // Date marriage start
    changeDropdown(form, 'select#root_startDateMonth', 1);
    changeDropdown(form, 'select#root_startDateDay', 1);
    fillData(form, 'input#root_startDateYear', '2010');
    // Marriage start location
    changeDropdown(form, 'select#root_startLocation_state', 'CA');
    fillData(form, 'input#root_startLocation_city', 'Outhere');
    // Reason marriage ended
    selectRadio(form, 'root_reasonMarriageEnded', 'Other');
    fillData(
      form,
      'input#root_reasonMarriageEndedOther',
      'This is an explanation',
    );
    // Date marriage ended
    changeDropdown(form, 'select#root_endDateMonth', 1);
    changeDropdown(form, 'select#root_endDateDay', 1);
    fillData(form, 'input#root_endDateYear', '2011');
    // Marriage end location
    changeDropdown(form, 'select#root_endLocation_state', 'CA');
    fillData(form, 'input#root_endLocation_city', 'Not here');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with a marriage start and end location outside the US', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        arrayPath={arrayPath}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    // Date marriage start
    changeDropdown(form, 'select#root_startDateMonth', 1);
    changeDropdown(form, 'select#root_startDateDay', 1);
    fillData(form, 'input#root_startDateYear', '2010');
    // Marriage start location
    selectCheckbox(form, 'root_startLocation_isOutsideUs', true);
    changeDropdown(form, 'select#root_startLocation_country', 'AFG');
    fillData(form, 'input#root_startLocation_city', 'Outhere');
    // Reason marriage ended
    selectRadio(form, 'root_reasonMarriageEnded', 'Other');
    fillData(
      form,
      'input#root_reasonMarriageEndedOther',
      'This is an explanation',
    );
    // Date marriage ended
    changeDropdown(form, 'select#root_endDateMonth', 1);
    changeDropdown(form, 'select#root_endDateDay', 1);
    fillData(form, 'input#root_endDateYear', '2011');
    // Marriage end location
    selectCheckbox(form, 'root_endLocation_isOutsideUs', true);
    changeDropdown(form, 'select#root_endLocation_country', 'AFG');
    fillData(form, 'input#root_endLocation_city', 'Not here');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
