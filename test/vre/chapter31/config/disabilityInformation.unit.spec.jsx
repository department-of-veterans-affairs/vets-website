import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, fillData, selectRadio } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/vre/chapter31/config/form.js';

describe('VRE chapter 31 disability information', () => {
  const { schema, uiSchema } = formConfig.chapters.disabilityInformation.pages.disabilityInformation;
  it('renders disability information form', () => {
    const form = mount(<DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      data={{}}
      formData={{}}
      uiSchema={uiSchema}/>
    );

    expect(form.find('input').length).to.equal(4);
  });

  it('renders hospital information form when in hospital is true', () => {
    const form = mount(<DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      data={{}}
      formData={{}}
      uiSchema={uiSchema}/>
    );

    selectRadio(form, 'root_view:inHospital', 'Y');

    expect(form.find('input').length).to.equal(9);
    expect(form.find('select').length).to.equal(3);
  });

  it('submits with required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );

    form.find('form').simulate('submit');
    fillData(form, 'select#root_disabilityRating', '10%');
    fillData(form, 'input#root_disabilities', 'Back ache');
    fillData(form, 'input#root_vaRecordsOffice', 'Local office');
    selectRadio(form, 'root_view:inHospital', 'N');
    expect(form.find('.usa-input-error').length).to.equal(0);
  });
});
