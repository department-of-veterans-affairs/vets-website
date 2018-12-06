import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  fillDate,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('686 spouse marriage history', () => {
  const marriageHistory =
    formConfig.chapters.currentSpouseInfo.pages.spouseMarriageHistory;
  const uiSchema = marriageHistory.uiSchema.spouseMarriages.items;
  const schema = marriageHistory.schema.properties.spouseMarriages.items;
  const depends = marriageHistory.depends;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{
          marriages: [
            {
              spouseFullName: {
                first: 'Jane',
                last: 'Doe',
              },
            },
          ],
        }}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(8);
    expect(form.find('select').length).to.equal(6);
    expect(form.find('#root_dateOfMarriage-label').text()).to.contain(
      'Jane Doe',
    );
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(7);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with valid data and add another', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fillData(form, 'input#root_spouseFullName_first', 'test');
    fillData(form, 'input#root_spouseFullName_last', 'test');
    fillDate(form, 'root_dateOfMarriage', '2001-10-21');
    const countryOfMarriage = form.find(
      'select#root_locationOfMarriage_countryDropdown',
    );
    countryOfMarriage.simulate('change', {
      target: { value: 'Canada' },
    });
    const countryOfSeparation = form.find(
      'select#root_locationOfSeparation_countryDropdown',
    );
    countryOfSeparation.simulate('change', {
      target: { value: 'Canada' },
    });
    fillDate(form, 'root_dateOfSeparation', '2002-11-21');
    selectRadio(form, 'root_reasonForSeparation', 'Death');

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('depends should return true if married and spouse was married before', () => {
    const result = depends({
      maritalStatus: 'MARRIED',
      spouseMarriages: [],
    });

    expect(result).to.be.true;
  });
});
