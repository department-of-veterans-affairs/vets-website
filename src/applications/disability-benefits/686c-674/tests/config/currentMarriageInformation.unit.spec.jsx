import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { changeDropdown } from '../helpers/index.js';
import {
  DefinitionTester,
  fillData,
  selectRadio,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('686 current marriage information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.currentMarriageInformation;

  const formData = {
    'view:selectable686Options': {
      addSpouse: true,
    },
    currentMarriageInformation: {
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
    expect(form.find('input').length).to.equal(8);
    form.unmount();
  });

  it('should not submit without all required fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with all required fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    changeDropdown(form, 'select#root_currentMarriageInformation_dateMonth', 1);
    changeDropdown(form, 'select#root_currentMarriageInformation_dateDay', 1);
    fillData(form, 'input#root_currentMarriageInformation_dateYear', '2010');
    changeDropdown(
      form,
      'select#root_currentMarriageInformation_location_state',
      'CA',
    );
    fillData(
      form,
      'input#root_currentMarriageInformation_location_city',
      'Los Angeles',
    );
    selectRadio(form, 'root_currentMarriageInformation_type', 'CEREMONIAL');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with a marriage location outside of the US', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    changeDropdown(form, 'select#root_currentMarriageInformation_dateMonth', 1);
    changeDropdown(form, 'select#root_currentMarriageInformation_dateDay', 1);
    fillData(form, 'input#root_currentMarriageInformation_dateYear', '2010');
    selectCheckbox(
      form,
      'root_currentMarriageInformation_location_isOutsideUs',
      true,
    );
    changeDropdown(
      form,
      'select#root_currentMarriageInformation_location_country',
      'AFG',
    );
    fillData(
      form,
      'input#root_currentMarriageInformation_location_city',
      'Some Place',
    );
    selectRadio(form, 'root_currentMarriageInformation_type', 'CEREMONIAL');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
