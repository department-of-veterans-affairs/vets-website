import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  selectCheckbox
} from '../../../../src/platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../../src/js/disability-benefits/526EZ/config/form.js';
import initialData from '../schema/initialData.js';

describe('Disability benefits 526EZ VA facility', () => {
  const {
    schema,
    uiSchema
  } = formConfig.chapters.veteranDetails.pages.primaryAddress;
  it('renders primary address form', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        formData={initialData}
        uiSchema={uiSchema}/>
    );

    expect(form.find('select').length).to.equal(4);
    expect(form.find('input').length).to.equal(10);
  });

  // it('should add a forwarding address', () => {
  //   const form = mount(
  //     <DefinitionTester
  //       definitions={formConfig.defaultDefinitions}
  //       schema={schema}
  //       data={initialData}
  //       formData={initialData}
  //       uiSchema={uiSchema}/>
  //   );

  //   selectCheckbox('#root_view:hasForwardingAddress', true);
  //   expect(form.find('select').length).to.equal(4);
  //   expect(form.find('input').length).to.equal(10);
  // });
  // it('does not submit without required information', () => {
  //   const onSubmit = sinon.spy();
  //   const form = mount(
  //     <DefinitionTester
  //       definitions={formConfig.defaultDefinitions}
  //       schema={schema}
  //       onSubmit={onSubmit}
  //       data={initialData}
  //       formData={initialData}
  //       uiSchema={uiSchema}/>
  //   );

  //   form.find('form').simulate('submit');
  //   expect(form.find('.usa-input-error').length).to.equal(2);
  //   expect(onSubmit.called).to.be.false;
  // });
  // it('submits with required information', () => {
  //   const onSubmit = sinon.spy();
  //   const form = mount(
  //     <DefinitionTester
  //       definitions={formConfig.defaultDefinitions}
  //       schema={schema}
  //       onSubmit={onSubmit}
  //       data={initialData}
  //       formData={initialData}
  //       uiSchema={uiSchema}/>
  //   );

  //   form.find('form').simulate('submit');
  //   expect(form.find('.usa-input-error').length).to.equal(0);
  //   expect(onSubmit.called).to.be.true;
  // });
});
