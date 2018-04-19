import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester
} from '../../../../src/platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../../src/js/disability-benefits/526EZ/config/form.js';
import initialData from '../../../../test/disability-benefits/526EZ/schema/initialData.js';

describe('Disability benefits 526EZ primary address', () => {
  const {
    schema,
    uiSchema
  } = formConfig.chapters.veteranDetails.pages.primaryAddress;
  it('renders primary address form', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}/>
    );

    expect(form.find('select').length).to.equal(2);
    expect(form.find('input').length).to.equal(9);
  });
  it('adds a forwarding address', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{ veteran: {
          'view:hasForwardingAddress': true
        }
        }}
        formData={{ veteran: {
          'view:hasForwardingAddress': true
        }
        }}
        uiSchema={uiSchema}/>
    );
    expect(form.find('select').length).to.equal(6);
    expect(form.find('input').length).to.equal(15);
  });
  it('does not submit without required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    expect(form.find('select').length).to.equal(2);
    expect(form.find('input').length).to.equal(9);
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
  });
  it('does submit with required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        formData={initialData}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
