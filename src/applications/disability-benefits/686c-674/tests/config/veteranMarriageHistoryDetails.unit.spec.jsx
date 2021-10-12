import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from 'platform/testing/unit/helpers';
import {
  DefinitionTester,
  fillData,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('686 veteran marriage history details', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addSpouse.pages.veteranMarriageHistoryDetails;

  const formData = {
    'view:selectable686Options': {
      addSpouse: true,
    },
    veteranWasMarriedBefore: true,
    veteranMarriageHistory: [
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
});
