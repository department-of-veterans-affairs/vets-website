import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { changeDropdown } from 'platform/testing/unit/helpers';
import formConfig from '../../config/form';

describe('686 report dependent death additional information', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.deceasedDependents.pages.dependentAdditionalInformation;

  const formData = {
    'view:selectable686Options': {
      reportDeath: true,
    },
    deaths: [
      {
        fullName: {
          first: 'Adam',
          last: 'Hubers',
        },
      },
    ],
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={formData}
        pagePerItemIndex={0}
        arrayPath={arrayPath}
      />,
    );
    expect(form.find('input').length).to.equal(5);
    form.unmount();
  });

  it('should not submit an empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={formData}
        pagePerItemIndex={0}
        arrayPath={arrayPath}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit a form with the required fields filled out', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={formData}
        pagePerItemIndex={0}
        arrayPath={arrayPath}
      />,
    );
    changeDropdown(form, 'select#root_dateMonth', 1);
    changeDropdown(form, 'select#root_dateDay', 1);
    fillData(form, 'input#root_dateYear', '2000');
    changeDropdown(form, 'select#root_dateMonth', 1);
    changeDropdown(form, 'select#root_location_state', 'CA');
    fillData(form, 'input#root_location_city', 'Someplace');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit a form with a location of death outside US', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={formData}
        pagePerItemIndex={0}
        arrayPath={arrayPath}
      />,
    );
    changeDropdown(form, 'select#root_dateMonth', 1);
    changeDropdown(form, 'select#root_dateDay', 1);
    fillData(form, 'input#root_dateYear', '2000');
    changeDropdown(form, 'select#root_dateMonth', 1);
    selectCheckbox(form, 'root_location_isOutsideUs', true);
    changeDropdown(form, 'select#root_location_country', 'AFG');
    fillData(form, 'input#root_location_city', 'Someplace');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
