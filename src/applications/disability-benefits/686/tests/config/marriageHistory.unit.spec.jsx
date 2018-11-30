import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  selectRadio,
  submitForm,
  fillData,
  fillDate,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('686 marriage history', () => {
  const marriageHistory =
    formConfig.chapters.householdInformation.pages.marriageHistory;
  const uiSchema = marriageHistory.uiSchema.marriages.items;
  const schema = marriageHistory.schema.properties.marriages.items;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(14);
  });

  describe('hideIf current marriage', () => {
    const hideIfCurrentMarriage =
      marriageHistory.uiSchema.marriages.items['view:pastMarriage'][
        'ui:options'
      ].hideIf;

    it('hides if married and last', () => {
      const result = hideIfCurrentMarriage(
        {
          maritalStatus: 'MARRIED',
          marriages: [{}],
        },
        0,
      );

      expect(result).to.be.true;
    });

    it('does not hide if married and not last', () => {
      const result = hideIfCurrentMarriage(
        {
          maritalStatus: 'MARRIED',
          marriages: [{}, {}],
        },
        0,
      );

      expect(result).to.be.false;
    });

    it('does not hide if not married', () => {
      const result = hideIfCurrentMarriage(
        {
          marriages: [{}],
        },
        0,
      );

      expect(result).to.be.false;
    });
  });

  describe('page title', () => {
    const pageTitle = marriageHistory.title;
    it('uses word for index', () => {
      expect(pageTitle({}, { pagePerItemIndex: 0 })).to.equal('First marriage');
    });
    it('uses number when at index ten or greater', () => {
      expect(pageTitle({}, { pagePerItemIndex: 10 })).to.equal('Marriage 11');
    });
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM(form);

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(7);
    expect(onSubmit.called).to.be.false;
  });

  it('should render Former spouse label for previous marriages', () => {
    const form = mount(
      <DefinitionTester
        data={{ marriages: { length: 2 } }}
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(
      form
        .find('#root_spouseFullName_first-label')
        .text()
        .includes('Former spouse'),
    ).to.be.true;
    expect(
      form
        .find('#root_spouseFullName_middle-label')
        .text()
        .includes('Former spouse'),
    ).to.be.true;
    expect(
      form
        .find('#root_spouseFullName_last-label')
        .text()
        .includes('Former spouse'),
    ).to.be.true;
  });

  it('should submit with valid data', () => {
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
    fillDate(form, 'root_dateOfMarriage', '2001-03-03');
    const countryOfMarriage = form.find(
      'select#root_locationOfMarriage_countryDropdown',
    );
    countryOfMarriage.simulate('change', {
      target: { value: 'Canada' },
    });
    fillDate(form, 'root_view:pastMarriage_dateOfSeparation', '2002-03-03');
    // I cannot for the life of me figure out why this selector fails to grab
    // the element.
    // const countryOfSeparation = form.find(
    //   'select#root_view:pastMarriage_locationOfSeparation_countryDropdown',
    // );
    // Grabbing the country drop down selector this way because using the actual
    // element ID isn't working
    const countryOfSeparation = form.find('select').last();
    countryOfSeparation.simulate('change', {
      target: { value: 'Canada' },
    });
    selectRadio(form, 'root_view:pastMarriage_reasonForSeparation', 'Divorce');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
