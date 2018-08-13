import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import _ from 'lodash';
import {
  DefinitionTester,
  fillData
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../complaint-tool/config/form';

describe('complaint tool school info', () => {
  const { schema, uiSchema } = formConfig.chapters.schoolInformation.pages.schoolInformation;
  _.unset(uiSchema, 'school.facilityCode');

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{
          school: {
            facilityCode: {
              'view:manualSchoolEntryChecked': true
            }
          }
        }}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}/>
    );

    expect(form.find('input').length).to.equal(6);
  });

  it('should not submit without required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{
          school: {
            facilityCode: {
              'view:manualSchoolEntryChecked': true
            }
          }
        }}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{
          school: {
            facilityCode: {
              'view:manualSchoolEntryChecked': true
            }
          }
        }}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    fillData(form, 'input[name="root_school_view:manualSchoolEntry_name"]', 'test');
    fillData(form, 'input[name="root_school_view:manualSchoolEntry_address_street"]', 'test');
    fillData(form, 'input[name="root_school_view:manualSchoolEntry_address_city"]', 'test');
    fillData(form, 'input[name="root_school_view:manualSchoolEntry_address_postalCode"]', '34343');
    fillData(form, 'select[name="root_school_view:manualSchoolEntry_address_state"]', 'MA');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
