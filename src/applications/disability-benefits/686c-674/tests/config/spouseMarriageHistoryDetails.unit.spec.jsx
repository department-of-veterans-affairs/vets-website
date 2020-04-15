import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from '../helpers/index.js';
import {
  DefinitionTester,
  fillData,
  selectRadio,
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
        formerSpouseName: {
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
    expect(form.find('input').length).to.equal(10);
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
    changeDropdown(form, 'select#root_marriageStartDateMonth', 1);
    changeDropdown(form, 'select#root_marriageStartDateDay', 1);
    fillData(form, 'input#root_marriageStartDateYear', '2010');
    // Marriage start location
    fillData(form, 'input#root_marriageStartLocation_state', 'Somewhere');
    fillData(form, 'input#root_marriageStartLocation_city', 'Outhere');
    // Reason marriage ended
    selectRadio(form, 'root_reasonMarriageEnded', 'DIVORCE');
    // Date marriage ended
    changeDropdown(form, 'select#root_marriageEndDateMonth', 1);
    changeDropdown(form, 'select#root_marriageEndDateDay', 1);
    fillData(form, 'input#root_marriageEndDateYear', '2011');
    // Marriage end location
    fillData(form, 'input#root_marriageEndLocation_state', 'Somewhere');
    fillData(form, 'input#root_marriageEndLocation_city', 'Not here');
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
    changeDropdown(form, 'select#root_marriageStartDateMonth', 1);
    changeDropdown(form, 'select#root_marriageStartDateDay', 1);
    fillData(form, 'input#root_marriageStartDateYear', '2010');
    // Marriage start location
    fillData(form, 'input#root_marriageStartLocation_state', 'Somewhere');
    fillData(form, 'input#root_marriageStartLocation_city', 'Outhere');
    // Reason marriage ended
    selectRadio(form, 'root_reasonMarriageEnded', 'OTHER');
    fillData(
      form,
      'input#root_reasonMarriageEndedOther',
      'This is an explanation',
    );
    // Date marriage ended
    changeDropdown(form, 'select#root_marriageEndDateMonth', 1);
    changeDropdown(form, 'select#root_marriageEndDateDay', 1);
    fillData(form, 'input#root_marriageEndDateYear', '2011');
    // Marriage end location
    fillData(form, 'input#root_marriageEndLocation_state', 'Somewhere');
    fillData(form, 'input#root_marriageEndLocation_city', 'Not here');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
