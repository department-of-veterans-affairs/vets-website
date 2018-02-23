import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, selectRadio } from '../../../util/schemaform-utils.jsx';
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

    expect(form.find('input').length).to.equal(5);
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
    expect(form.find('select').length).to.equal(2);
  });

  it('submits without information', () => {
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

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
