import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from 'platform/testing/unit/helpers';

import {
  DefinitionTester,
  selectRadio,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('Chapter 31 Additional Information Page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.additionalInformation.pages.additionalInformation;
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should submit with NOT moving in 30 days selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );

    changeDropdown(form, 'select#root_yearsOfEducation', '17');
    selectRadio(form, 'root_isMoving', 'N');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with moving in 30 days selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );

    changeDropdown(form, 'select#root_yearsOfEducation', '17');
    selectRadio(form, 'root_isMoving', 'Y');

    // New address
    changeDropdown(form, 'select#root_newAddress_country', 'USA');
    fillData(form, 'input#root_newAddress_street', '101 someplace drive');
    fillData(form, 'input#root_newAddress_city', 'Someplace');
    changeDropdown(form, 'select#root_newAddress_state', 'AL');
    fillData(form, 'input#root_newAddress_postalCode', '12345');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
